.PHONY: test build deploy

test:
	cd contracts && cargo test
	cd backend && npm test
	cd frontend && npm test

build:
	cd contracts && cargo build --target wasm32-unknown-unknown --release

deploy:
	cd contracts && stellar contract deploy \
		--wasm target/wasm32-unknown-unknown/release/prediction_market.wasm \
		--source $(STELLAR_SOURCE) \
		--network $(STELLAR_NETWORK)

lint:
	cd contracts && cargo clippy -- -D warnings
	cd backend && npm run lint
	cd frontend && npm run lint
