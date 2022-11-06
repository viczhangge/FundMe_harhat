const networkConfig = {
  5: {
    name: "goerli",
    ethUSDPriceFeed: "0xd4a33860578de61dbabdc8bfdb98fd742fa7028e",
  },
  137: {
    name: "polygon",
    ethUSDPriceFeed: "0xf9680d99d6c9589e2a93a78a04a279e509205945",
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMAL = 8;
const INITIAL_ANSWER = 20000000000;

module.exports = {
  networkConfig,
  developmentChains,
  DECIMAL,
  INITIAL_ANSWER,
};
