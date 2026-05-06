# Contributing to Conviction

Thanks for your interest in contributing! Please read this before opening a PR.

## Ways to Contribute

- Bug reports and feature requests → open a GitHub Issue
- Code → follow the workflow below
- Documentation and design → PRs welcome
- Testnet testing → report findings in Issues

## Workflow

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/conviction.git
cd conviction

# 2. Create a branch
git checkout -b feat/your-feature   # or fix/your-fix

# 3. Make changes and test
make test

# 4. Commit using Conventional Commits
git commit -m "feat: add conviction curve chart"
git commit -m "fix: off-by-one in multiplier calculation"

# 5. Push and open a PR against main
git push origin feat/your-feature
```

## Commit Convention

| Prefix | Use for |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Tooling, deps, config |
| `docs` | Documentation only |
| `test` | Tests only |
| `refactor` | No behaviour change |

## Code Standards

- **Rust**: follow [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/). Run `cargo clippy -- -D warnings`.
- **TypeScript**: ESLint + Prettier (configs included). Run `npm run lint`.
- **Smart contracts**: unit tests **and** fuzz tests required for all financial logic.
- Any code that touches funds requires audit review before merge.

## Pull Request Checklist

- [ ] `make test` passes locally
- [ ] New behaviour is covered by tests
- [ ] No secrets or `.env` files committed
- [ ] PR description explains *what* and *why*

## Reporting Security Issues

Do **not** open a public issue. Email [security@conviction.markets](mailto:security@conviction.markets). We respond within 48 hours.
