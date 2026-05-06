# Conviction

**Conviction-Weighted Social Prediction Markets on Stellar**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Stellar Soroban](https://img.shields.io/badge/Stellar-Soroban-7C3AED)](https://soroban.stellar.org)
[![Base EVM](https://img.shields.io/badge/Base-EVM-0052FF)](https://base.org)

> Prediction markets that reward *when* you believed, not just *that* you were right.

Conviction introduces time-weighted conviction staking on Stellar Soroban — the longer you hold your position, the more your multiplier grows. Early, consistent predictors earn outsized reputation and rewards. The platform doubles as a social graph of provably prescient voices.

---

## Table of Contents

- [Why Conviction?](#why-conviction)
- [Core Concepts](#core-concepts)
- [Architecture](#architecture)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [Testing](#testing)
- [License](#license)

---

## Why Conviction?

| Traditional Prediction Markets | Conviction |
|---|---|
| All correct predictors equal | Early conviction rewarded with multipliers |
| Binary win/loss | Gradual resolution reflects real-world nuance |
| Pure speculation | Social reputation surfaces genuine insight |
| Single-chain locked | Stellar core, expandable to EVM |
| No community mechanics | Circles enable collaborative forecasting |

---

## Core Concepts

### 1. Conviction Staking

When you stake on an outcome, your conviction score starts at `1.0x` and grows along a time-weighted bonding curve:

```
C(t) = 1 + log₂(1 + t/7d)
```

| Time Staked | Multiplier |
|---|---|
| 0 days | 1.00x |
| 7 days | 1.25x |
| 30 days | 1.75x |
| 90 days | 2.50x |
| 180 days | 3.25x |
| 365 days | 5.00x |

> **Key rule:** Unstaking before resolution forfeits all accumulated conviction. Commitment is rewarded; reactionary betting is penalized.

### 2. Gradual Resolution

Markets resolve in tranches as real-world evidence accumulates via oracle checkpoints — not as a single binary outcome at a deadline.

```
Example: "BTC will outperform ETH in Q3 2026"

Week 1:  BTC +2.3%, ETH +1.1% → 25% payout to BTC predictors
Week 6:  ETH surges ahead    → 25% payout shifts to ETH predictors
Week 12: Final resolution    → remaining 50% distributed
```

### 3. Prediction Circles

Gated, themed communities where members pool stakes, share a collective reputation score, and govern via Stellar multisig.

| Circle Type | Access |
|---|---|
| Public | Anyone can view and stake to join |
| Application | Submit proof of past accuracy |
| Token-Gated | Hold platform tokens |
| Paid | Monthly x402 subscription pass |

### 4. On-Chain Reputation

Reputation is stored permanently on Stellar as a data entry on your account — soulbound, non-transferable, and portable.

```json
{
  "total_predictions": 247,
  "accuracy_rate": 0.73,
  "avg_conviction_days": 42,
  "reputation_tier": "Prophet"
}
```

| Tier | Requirements |
|---|---|
| 🥉 Apprentice | 10+ predictions |
| 🥈 Oracle | 50+ predictions, 60%+ accuracy |
| 🥇 Sage | 200+ predictions, 70%+ accuracy, avg conviction >30 days |
| 💎 Prophet | 500+ predictions, 80%+ accuracy, avg conviction >60 days |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                             │
│  Social Feed · Market Detail · Profile · Circle Dashboard   │
│              Freighter / Albedo Wallet                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Backend Services                          │
│   Indexer · Oracle Network · x402 Gateway · Identity        │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                    Stellar Soroban                           │
│                                                             │
│  Prediction Market ──┐                                      │
│  Reputation Registry ┼──► Conviction Engine Contract        │
│  Circle Governance ──┘     (curves · resolution · rewards)  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────┼─────────────────────────────────┐
│                  EVM Expansion (Base)                        │
│         Prediction Market · Bridge · EVM Staking            │
└──────────────────────────────────────────────────────────────┘
```

**Technology Stack**

| Layer | Technology |
|---|---|
| Smart Contracts | Rust (Soroban SDK) |
| Stellar Integration | Stellar SDK (JS/Rust) |
| Wallet | Freighter, Albedo |
| Backend | Node.js / Rust |
| Database | PostgreSQL + Redis |
| Frontend | Next.js, TailwindCSS |
| Indexer | Custom (Mercury-inspired) |
| Monetization | x402 Stellar SDK |

---

## Smart Contracts

```
contracts/
├── prediction-market/     # Market creation, staking, conviction curves, resolution
├── reputation/            # On-chain reputation registry and tier management
└── circle/                # Circle governance, membership, collective staking
```

### Prediction Market

```rust
fn create_market(env: Env, creator: Address, title: String, outcomes: Vec<String>,
    resolution_type: ResolutionType, oracle_address: Address, deadline: u64,
    min_stake: i128) -> Result<MarketId, Error>;

fn stake_with_conviction(env: Env, staker: Address, market_id: MarketId,
    outcome_index: u32, amount: i128) -> Result<StakeReceipt, Error>;

fn resolve_checkpoint(env: Env, market_id: MarketId,
    oracle_data: Vec<OracleDataPoint>) -> Result<ResolutionResult, Error>;

fn claim_rewards(env: Env, staker: Address, market_id: MarketId) -> Result<i128, Error>;
```

### Reputation

```rust
fn update_reputation(env: Env, user: Address, was_correct: bool,
    conviction_days: u32, amount_staked: i128) -> Result<ReputationScore, Error>;

fn get_reputation(env: Env, user: Address) -> Result<ReputationScore, Error>;
```

### Circle

```rust
fn create_circle(env: Env, creator: Address, name: String, circle_type: CircleType,
    min_reputation: Option<ReputationTier>, membership_fee: Option<i128>) -> Result<CircleId, Error>;

fn join_circle(env: Env, user: Address, circle_id: CircleId,
    proof: Option<Vec<u8>>) -> Result<MembershipId, Error>;

fn circle_stake(env: Env, circle_id: CircleId, market_id: MarketId,
    outcome_index: u32, amount: i128, signers: Vec<Signature>) -> Result<StakeReceipt, Error>;
```

---

## Getting Started

### Prerequisites

- Rust 1.70+
- Node.js 18+
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli)
- [Freighter Wallet](https://freighter.app)
- Docker

### Installation

```bash
# 1. Clone
git clone https://github.com/your-username/conviction.git
cd conviction

# 2. Install contract toolchain
cd contracts
rustup target add wasm32-unknown-unknown
cargo install --locked stellar-cli

# 3. Install backend & frontend deps
cd ../backend && npm install
cd ../frontend && npm install

# 4. Configure environment
cp .env.example .env
# Edit .env — see below for required variables
```

**Required environment variables:**

```env
STELLAR_NETWORK=testnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
DATABASE_URL=postgresql://localhost:5432/conviction
REDIS_URL=redis://localhost:6379
ORACLE_PRIVATE_KEY=S...
X402_API_KEY=...
```

### Run Locally

```bash
# Start local Stellar network
stellar quickstart --local

# Build and deploy contracts
cd contracts
stellar contract build
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/prediction_market.wasm \
  --source S... \
  --network testnet

# Database setup
cd ../backend
npx prisma migrate dev
npm run seed

# Start servers (two terminals)
npm run dev          # backend → :4000
cd ../frontend && npm run dev  # frontend → :3000
```

Open [http://localhost:3000](http://localhost:3000).

---

## API Reference

### Markets
```
GET    /api/v1/markets              # List markets
GET    /api/v1/markets/:id          # Market details
POST   /api/v1/markets              # Create market
GET    /api/v1/markets/:id/stakes   # Stakes for a market
```

### Staking
```
POST   /api/v1/stakes               # Create stake
GET    /api/v1/stakes/:id/conviction # Current conviction multiplier
DELETE /api/v1/stakes/:id           # Unstake (forfeits conviction)
POST   /api/v1/stakes/:id/claim     # Claim rewards
```

### Reputation
```
GET    /api/v1/users/:address/reputation  # User reputation
GET    /api/v1/leaderboard                # Global leaderboard
GET    /api/v1/leaderboard/circles/:id    # Circle leaderboard
```

### Circles
```
GET    /api/v1/circles               # List circles
POST   /api/v1/circles               # Create circle
POST   /api/v1/circles/:id/join      # Join circle
POST   /api/v1/circles/:id/stake     # Submit circle prediction
GET    /api/v1/circles/:id/members   # Circle members
```

### Oracle
```
POST   /api/v1/oracle/report         # Submit oracle data point
GET    /api/v1/oracle/:market_id     # Oracle data for market
```

---

## Roadmap

| Phase | Timeline | Focus |
|---|---|---|
| **1 — Foundation** | Q2 2026 | Core contracts, binary staking, testnet, Freighter integration |
| **2 — Conviction Mechanics** | Q3 2026 | Time-weighted curves, gradual resolution, oracle network, reputation tiers |
| **3 — Social Layer** | Q3–Q4 2026 | Prediction Circles, social feed, user profiles, mobile-responsive |
| **4 — Monetization** | Q4 2026 | x402 subscriptions, platform token, mainnet launch, SCF grant |
| **5 — Multi-Chain** | Q1 2027 | Base (EVM) deployment, Stellar-EVM bridge, cross-chain markets, mobile app |

---

## Contributing

Contributions are welcome. Please read this section before opening a PR.

**Ways to contribute:** bug reports, feature requests (discuss in GitHub Discussions first), code, documentation, design, and testnet testing.

### Workflow

```bash
# 1. Fork and branch
git checkout -b feature/your-feature-name

# 2. Make changes, then test
cd contracts && cargo test
cd backend && npm test
cd frontend && npm test

# 3. Commit using Conventional Commits
git commit -m "feat: add conviction curve visualization"
git commit -m "fix: resolve staking edge case on leap days"

# 4. Push and open a PR
git push origin feature/your-feature-name
```

**Code standards:**
- Rust: [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/)
- TypeScript: ESLint + Prettier (configs included)
- Smart contracts: unit tests **and** fuzz tests required for all financial logic
- Any code handling funds requires audit review before merge

---

## Security

| Status | Item |
|---|---|
| ✅ | Internal security review |
| 🔜 | External audit (planned before mainnet) |
| 🔜 | Bug bounty program |

**Key security properties:**
- Conviction multiplier calculations are deterministic and gas-efficient
- Oracle manipulation resistance via multiple sources and time-weighted averages
- Circle treasury multisig requires ≥3 signatures; large withdrawals have a timelock
- All payout functions follow checks-effects-interactions (reentrancy protection)
- Minimum stake requirements for market creation and reputation accrual (Sybil resistance)

**Responsible disclosure:** Email [security@conviction.markets](mailto:security@conviction.markets) — do not open a public issue. We respond within 48 hours.

---

## Testing

```bash
make test                          # Run all tests

# Smart contracts
cd contracts && cargo test
cargo test --test integration -- --nocapture  # requires local network

# Backend & frontend
cd backend && npm test
cd frontend && npm test

# E2E (requires local network + backend)
npm run test:e2e

# Load testing
npm run test:load
```

**Coverage targets:** Smart contracts 95%+ · Backend API 85%+ · Frontend components 80%+

---

## License

MIT — see [LICENSE](LICENSE).

---

## Acknowledgments

- [Stellar Development Foundation](https://stellar.org) — Soroban smart contract platform
- [Stellar Community Fund](https://communityfund.stellar.org) — Ecosystem support
- [Freighter](https://freighter.app) — Stellar browser wallet
- [Mercury](https://mercurydata.app) — Indexing infrastructure inspiration

---

<p align="center">
  <a href="https://conviction.markets">conviction.markets</a> ·
  <a href="https://twitter.com/ConvictionMkts">@ConvictionMkts</a> ·
  <a href="https://discord.gg/conviction">Discord</a> ·
  <a href="mailto:hello@conviction.markets">hello@conviction.markets</a>
</p>

<p align="center"><strong>Build conviction. Earn reputation. Predict the future.</strong></p>
