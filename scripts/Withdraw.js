const { ethers, getNamedAccounts } = require("hardhat");
async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);

  console.log("withdraw the contract");
  const fundMeTXResponse = await fundMe.withdraw();
  await fundMeTXResponse.wait(1);
  console.log("withdraw ending");
  // equal to 0
  console.log(
    ((await fundMe.provider.getBalance(fundMe.address)) * 1e-18).toString()
  );

  console.log(
    ((await fundMe.provider.getBalance(deployer)) * 1e-18).toString()
  );
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
