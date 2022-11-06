// import
// main func
// call main func

const { network } = require("hardhat");

const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");

const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  // get the deployder's name well
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;

  if (developmentChains.includes(network.name)) {
    const ethAggregater = await deployments.get("MockV3Aggregator");
    ethUsdPriceFeedAddress = ethAggregater.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"];
  }
  log("----------------------------------------------------");
  log("Deploying FundMe and waiting for confirmations...");
  const args = [ethUsdPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log(`FundMe deployed at ${fundMe.address}`);

  if (!developmentChains.includes(network.name) && process.env.ETHER_SCAN_API) {
    // await verify(fundMe.address, args);
    console.log("verifying");
  }
  log("----------------------------------");
};

module.exports.tags = ["all", "fundme"];
