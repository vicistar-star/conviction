#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String};

#[contracttype]
#[derive(Clone)]
pub enum CircleType {
    Public,
    Application,
    TokenGated,
    Paid,
}

#[contracttype]
#[derive(Clone)]
pub struct Circle {
    pub creator: Address,
    pub name: String,
    pub circle_type: CircleType,
    pub membership_fee: i128,
    pub member_count: u32,
}

#[contracttype]
pub enum DataKey {
    Circle(u64),
    CircleCount,
    Member(u64, Address),
}

#[contract]
pub struct CircleContract;

#[contractimpl]
impl CircleContract {
    pub fn create_circle(
        env: Env,
        creator: Address,
        name: String,
        circle_type: CircleType,
        membership_fee: i128,
    ) -> u64 {
        creator.require_auth();

        let id: u64 = env.storage().instance().get(&DataKey::CircleCount).unwrap_or(0) + 1;

        let circle = Circle {
            creator: creator.clone(),
            name,
            circle_type,
            membership_fee,
            member_count: 1,
        };

        env.storage().instance().set(&DataKey::Circle(id), &circle);
        env.storage().instance().set(&DataKey::CircleCount, &id);
        // Creator is auto-member
        env.storage().instance().set(&DataKey::Member(id, creator), &true);
        id
    }

    pub fn join_circle(env: Env, user: Address, circle_id: u64) {
        user.require_auth();

        let mut circle: Circle = env
            .storage()
            .instance()
            .get(&DataKey::Circle(circle_id))
            .expect("circle not found");

        let already_member: bool = env
            .storage()
            .instance()
            .get(&DataKey::Member(circle_id, user.clone()))
            .unwrap_or(false);

        assert!(!already_member, "already a member");

        circle.member_count += 1;
        env.storage().instance().set(&DataKey::Circle(circle_id), &circle);
        env.storage().instance().set(&DataKey::Member(circle_id, user), &true);
    }

    pub fn get_circle(env: Env, circle_id: u64) -> Circle {
        env.storage()
            .instance()
            .get(&DataKey::Circle(circle_id))
            .expect("circle not found")
    }

    pub fn is_member(env: Env, circle_id: u64, user: Address) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Member(circle_id, user))
            .unwrap_or(false)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_create_and_join_circle() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, CircleContract);
        let client = CircleContractClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let member = Address::generate(&env);

        let id = client.create_circle(
            &creator,
            &String::from_str(&env, "Alpha Circle"),
            &CircleType::Public,
            &0,
        );
        assert_eq!(id, 1);
        assert!(client.is_member(&id, &creator));

        client.join_circle(&member, &id);
        assert!(client.is_member(&id, &member));
    }
}
