# Uniswap V2 contracts for Boltchain

## Usage

1. Create `.env` file to deploy

```bash
cp .env.example .env
```

2. `yarn`

```bash
yarn
```

### Deploy & Test

```bash
yarn deploy:boltchain
```

## 🚨 ATTENTION 🚨
Each time you update `UniswapV2Pair.sol` contract, you need to update the hex
value in this line:

https://github.com/Switcheo/bolt-evm-dex-core/blob/master/contracts/libraries/UniswapV2Library.sol#L37

Use this command to get a new value:
```
$ cat artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json| jq -r .bytecode| xargs cast keccak| cut -c 3-
```

(Ensure you have [jq](https://stedolan.github.io/jq) and [cast](https://github.com/foundry-rs/foundry)
installed)

**Why?** Uniswap V2 uses [CREATE2](https://www.evm.codes/#f5) opcode to deploy pair contracts. This opcode
allows to generate contract addresses deterministically without depending on external state (deployer's
nonce). Instead, it uses the hash of the deployed contract code and salt:

https://github.com/Switcheo/bolt-evm-dex-core/blob/master/contracts/UniswapV2Factory.sol#L42

Each time you update the Pair contract (even when you change compiler version), its bytecode changes, which
means the hash of the bytecode also changes.