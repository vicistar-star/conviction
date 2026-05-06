#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, vec, Address, Env, String, Vec};

#[contracttype]
#[derive(Clone)]
pub enum ResolutionType {
    Binary,
    Gradual,
}

#[contracttype]
#[derive(Clone)]
pub struct Market {
    pub creator: Address,
    pub title: String,
    pub outcomes: Vec<String>,
    pub resolution_type: ResolutionType,
    pub oracle: Address,
    pub deadline: u64,
    pub min_stake: i128,
    pub resolved: bool,
}

#[contracttype]
#[derive(Clone)]
pub struct Stake {
    pub staker: Address,
    pub market_id: u64,
    pub outcome_index: u32,
    pub amount: i128,
    pub staked_at: u64,
}

#[contracttype]
pub enum DataKey {
    Market(u64),
    Stake(u64),
    MarketCount,
    StakeCount,
}

#[contract]
pub struct PredictionMarket;

#[contractimpl]
impl PredictionMarket {
    /// Create a new prediction market.
    pub fn create_market(
        env: Env,
        creator: Address,
        title: String,
        outcomes: Vec<String>,
        resolution_type: ResolutionType,
        oracle: Address,
        deadline: u64,
        min_stake: i128,
    ) -> u64 {
        creator.require_auth();

        let id: u64 = env.storage().instance().get(&DataKey::MarketCount).unwrap_or(0) + 1;

        let market = Market {
            creator,
            title,
            outcomes,
            resolution_type,
            oracle,
            deadline,
            min_stake,
            resolved: false,
        };

        env.storage().instance().set(&DataKey::Market(id), &market);
        env.storage().instance().set(&DataKey::MarketCount, &id);
        id
    }

    /// Stake on an outcome with conviction.
    pub fn stake_with_conviction(
        env: Env,
        staker: Address,
        market_id: u64,
        outcome_index: u32,
        amount: i128,
    ) -> u64 {
        staker.require_auth();

        let market: Market = env
            .storage()
            .instance()
            .get(&DataKey::Market(market_id))
            .expect("market not found");

        assert!(amount >= market.min_stake, "below minimum stake");
        assert!(!market.resolved, "market already resolved");

        let stake_id: u64 = env.storage().instance().get(&DataKey::StakeCount).unwrap_or(0) + 1;

        let stake = Stake {
            staker,
            market_id,
            outcome_index,
            amount,
            staked_at: env.ledger().timestamp(),
        };

        env.storage().instance().set(&DataKey::Stake(stake_id), &stake);
        env.storage().instance().set(&DataKey::StakeCount, &stake_id);
        stake_id
    }

    /// Compute conviction multiplier: C(t) = 1 + log2(1 + t/7d).
    /// Uses integer arithmetic scaled by 1000 (e.g. 1250 = 1.25x).
    pub fn conviction_multiplier(env: Env, stake_id: u64) -> u64 {
        let stake: Stake = env
            .storage()
            .instance()
            .get(&DataKey::Stake(stake_id))
            .expect("stake not found");

        let now = env.ledger().timestamp();
        let elapsed_secs = now.saturating_sub(stake.staked_at);
        let seven_days: u64 = 7 * 24 * 3600;

        // Approximate log2(1 + t/7d) * 1000 using integer math
        let ratio = (elapsed_secs * 1000) / seven_days; // t/7d * 1000
        let log_approx = Self::log2_approx(1000 + ratio); // log2((1000 + ratio)/1000) * 1000
        1000 + log_approx
    }

    /// Integer log2 approximation scaled by 1000.
    fn log2_approx(x: u64) -> u64 {
        if x <= 1000 {
            return 0;
        }
        // Count integer bits then interpolate
        let mut val = x;
        let mut bits: u64 = 0;
        while val > 1000 {
            val = (val * 1000) / 2000;
            bits += 1000;
        }
        bits
    }

    /// Get market by id.
    pub fn get_market(env: Env, market_id: u64) -> Market {
        env.storage()
            .instance()
            .get(&DataKey::Market(market_id))
            .expect("market not found")
    }

    /// Get stake by id.
    pub fn get_stake(env: Env, stake_id: u64) -> Stake {
        env.storage()
            .instance()
            .get(&DataKey::Stake(stake_id))
            .expect("stake not found")
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_create_market() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, PredictionMarket);
        let client = PredictionMarketClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let oracle = Address::generate(&env);
        let outcomes = vec![&env, String::from_str(&env, "Yes"), String::from_str(&env, "No")];

        let id = client.create_market(
            &creator,
            &String::from_str(&env, "BTC > 100k by EOY?"),
            &outcomes,
            &ResolutionType::Binary,
            &oracle,
            &9999999999,
            &100,
        );
        assert_eq!(id, 1);
    }

    #[test]
    fn test_stake_with_conviction() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, PredictionMarket);
        let client = PredictionMarketClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let oracle = Address::generate(&env);
        let staker = Address::generate(&env);
        let outcomes = vec![&env, String::from_str(&env, "Yes"), String::from_str(&env, "No")];

        let market_id = client.create_market(
            &creator,
            &String::from_str(&env, "Test Market"),
            &outcomes,
            &ResolutionType::Binary,
            &oracle,
            &9999999999,
            &100,
        );

        let stake_id = client.stake_with_conviction(&staker, &market_id, &0, &500);
        assert_eq!(stake_id, 1);
    }
}
