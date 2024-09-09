import { HardhatUserConfig } from "hardhat/config";

import "@nomicfoundation/hardhat-toolbox";

import * as dotenv from "dotenv";
dotenv.config();

// tasks
import "./src/tasks/accounts";

const config: HardhatUserConfig = {
  etherscan: {
    apiKey: process.env.API_KEY ?? "",
    customChains: [
      {
        network: 'boltchain',
        chainId: 16481,
        urls: {
          apiURL: "https://sepolia.pivotalscan.xyz/api",
          browserURL: "https://sepolia.pivotalscan.xyz"
        }
      }
    ]
  },
  networks: {
    hardhat: {
      blockGasLimit: 30000000,
    },
    boltchain: {
      url: "https://sepolia.pivotalprotocol.com",
      accounts: {
        mnemonic: process.env.MNEMONIC ?? "test test test test test test test test test test test test"
      }
    }
  },
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5",
  },
  paths: {
    tests: "./src/test",
  },
};

export default config;
