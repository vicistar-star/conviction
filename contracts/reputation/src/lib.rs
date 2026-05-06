#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env};

#[contracttype]
#[derive(Clone, PartialEq)]
pub enum ReputationTier {
    Apprentice,
    Oracle,
    Sage,
    Prophet,
}

#[contracttype]
#[derive(Clone)]
pub struct ReputationScore {
    pub total_predictions: u32,
    pub correct_predictions: u32,
    pub total_conviction_days: u32,
    pub tier: ReputationTier,
}

#[contracttype]
pub enum DataKey {
    Reputation(Address),
}

#[contract]
pub struct ReputationRegistry;

#[contractimpl]
impl ReputationRegistry {
    /// Update reputation after a market resolves.
    pub fn update_reputation(
        env: Env,
        user: Address,
        was_correct: bool,
        conviction_days: u32,
        _amount_staked: i128,
    ) -> ReputationScore {
        let mut score: ReputationScore = env
            .storage()
            .persistent()
            .get(&DataKey::Reputation(user.clone()))
            .unwrap_or(ReputationScore {
                total_predictions: 0,
                correct_predictions: 0,
                total_conviction_days: 0,
                tier: ReputationTier::Apprentice,
            });

        score.total_predictions += 1;
        if was_correct {
            score.correct_predictions += 1;
        }
        score.total_conviction_days += conviction_days;
        score.tier = Self::compute_tier(&score);

        env.storage()
            .persistent()
            .set(&DataKey::Reputation(user), &score);
        score
    }

    pub fn get_reputation(env: Env, user: Address) -> ReputationScore {
        env.storage()
            .persistent()
            .get(&DataKey::Reputation(user))
            .unwrap_or(ReputationScore {
                total_predictions: 0,
                correct_predictions: 0,
                total_conviction_days: 0,
                tier: ReputationTier::Apprentice,
            })
    }

    fn compute_tier(score: &ReputationScore) -> ReputationTier {
        let accuracy = if score.total_predictions == 0 {
            0u32
        } else {
            (score.correct_predictions * 100) / score.total_predictions
        };
        let avg_conviction = if score.total_predictions == 0 {
            0u32
        } else {
            score.total_conviction_days / score.total_predictions
        };

        if score.total_predictions >= 500 && accuracy >= 80 && avg_conviction >= 60 {
            ReputationTier::Prophet
        } else if score.total_predictions >= 200 && accuracy >= 70 && avg_conviction >= 30 {
            ReputationTier::Sage
        } else if score.total_predictions >= 50 && accuracy >= 60 {
            ReputationTier::Oracle
        } else {
            ReputationTier::Apprentice
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_reputation_update() {
        let env = Env::default();
        let contract_id = env.register_contract(None, ReputationRegistry);
        let client = ReputationRegistryClient::new(&env, &contract_id);

        let user = Address::generate(&env);
        let score = client.update_reputation(&user, &true, &30, &1000);
        assert_eq!(score.total_predictions, 1);
        assert_eq!(score.correct_predictions, 1);
    }
}
