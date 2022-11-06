require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan");

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const EtherScan_Api_Key = process.env.ETHER_SCAN_API;
const CoinMarket_API_KEY = process.env.COIN_MARKET_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: GOERLI_RPC_URL || "",
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  gasReporter: {
    enabled: false,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: CoinMarket_API_KEY,
    token: "ETH",
  },

  etherscan: {
    apiKey: EtherScan_Api_Key,
  },

  namedAccounts: {
    deployer: {
      default: 0,
      // 在测试网络中,使用0， 否则容易报错
      5: 0,
      31337: 0,
    },
    users: {
      default: 1,
    },
  },

  solidity: {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
  },
  mocha: {
    timeout: 500000,
  },
};
