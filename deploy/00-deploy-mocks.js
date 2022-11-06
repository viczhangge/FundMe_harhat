const { network } = require("hardhat");
const {
  developmentChains,
  DECIMAL,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log("local host detected, deploy the aggregatorV3");
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMAL, INITIAL_ANSWER],
    });
    log("mocks is deployed");
    log("------------------------------------------");
  }
};

module.exports.tags = ["all", "mocks"];
