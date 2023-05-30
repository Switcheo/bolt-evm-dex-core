import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

const { ethers, run, network } = require("hardhat");
const hre = require("hardhat");

const ether = ethers.utils.parseEther;

interface Constants {
  WETH9: string;
  UniswapV2Factory: string;
  UniswapV2Router: string;
  Multicall: string;
}

// Read constant.json
const fs = require("fs");
const path = require("path");
// const constants: Constants = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../constant.json'), "utf8"));

async function main() {
  const [owner] = await ethers.getSigners();
  const provider = ethers.getDefaultProvider();

  // const { WETH9, UniswapV2Factory, UniswapV2Router, Multicall } = constants;

  // ========== Deploy WETH9 ==========
  console.log("Deploying WETH9...");

  // const weth = await hre.ethers.getContractAt("contracts/WETH.sol:WETH9", "0x36A61a9f5002c505f1046ceE5765D603594e9208");

  const WETH = await ethers.getContractFactory("contracts/WETH.sol:WETH9");
  const weth = await WETH.deploy();

  await weth.deployed();

  console.log(`Contract deployed to ${weth.address} on ${network.name}`);

  console.log(`Verifying contract on Boltchain...`);

  await run("verify:verify", {
    address: weth.address,
    constructorArguments: [],
  });

  // ========== Deploy Multicall ==========
  console.log("Deploying Multicall...");
  const Multicall = await ethers.getContractFactory("Multicall");
  const multicall = await Multicall.deploy();

  await multicall.deployed();

  console.log(`Contract deployed to ${multicall.address} on ${network.name}`);

  console.log(`Verifying contract on Boltchain...`);

  await run("verify:verify", {
    address: multicall.address,
    constructorArguments: [],
  });

  // ========== Deploy UniswapV2Factory ==========

  // const factory = await hre.ethers.getContractAt("contracts/UniswapV2Factory.sol:UniswapV2Factory", "0xDcE5BAa3583Fd40fd739Fc71911e4c11894E02EA");

  console.log("Deploying UniswapV2Factory...");
  const Factory = await ethers.getContractFactory("UniswapV2Factory");
  const factory = await Factory.deploy(owner.address);

  await factory.deployed();

  console.log(`Contract deployed to ${factory.address} on ${network.name}`);

  console.log(`Verifying contract on Boltchain...`);

  await run("verify:verify", {
    address: factory.address,
    constructorArguments: [owner.address],
  });

  // ========== Deploy UniswapV2Router ==========
  console.log("Deploying UniswapV2Router...");

  // const router = await hre.ethers.getContractAt("contracts/UniswapV2Router.sol:UniswapV2Router", "0xF74Abbf5deABaEb15186E16A8B6abB9DDDBFB757");

  const Router = await ethers.getContractFactory("UniswapV2Router");
  const router = await Router.deploy(factory.address, weth.address);

  await router.deployed();

  console.log(`Contract deployed to ${router.address} on ${network.name}`);

  console.log(`Verifying contract on Boltchain...`);

  await run("verify:verify", {
    address: router.address,
    constructorArguments: [factory.address, weth.address],
  });

  console.log("Deployed contracts:");
  console.log(weth.address, "– WETH");
  console.log(factory.address, "– Factory");
  console.log(router.address, "– Router");
  console.log(multicall.address, "– Multicall");

  const constant = {
    WETH9: weth.address,
    UniswapV2Factory: factory.address,
    UniswapV2Router: router.address,
    Multicall: multicall.address,
  };

  // Write to the json file
  fs.writeFileSync(
    path.resolve(__dirname, "../../constant.json"),
    JSON.stringify(constant, null, 2)
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
