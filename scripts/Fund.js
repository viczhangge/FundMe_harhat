const { ethers, getNamedAccounts } = require("hardhat");
async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);

  console.log("funding the contract");
  const sendValue = ethers.utils.parseEther("0.1");
  const fundMeTXResponse = await fundMe.fund({ value: sendValue });
  await fundMeTXResponse.wait(1);
  console.log("funding end");
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
