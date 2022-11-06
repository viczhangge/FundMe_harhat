const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Fundme on test chains", async () => {
      let fundMe;
      let deployer;
      const sendValue = ethers.utils.parseEther("0.02");
      beforeEach(async function() {
        // deploy all the contract
        deployer = (await getNamedAccounts()).deployer;
        fundMe = await ethers.getContract("FundMe", deployer);
        console.log(fundMe.address);
        console.log(network.chainID);
      });
      it("allow people fund and withdraw", async () => {
        const fundTxResponse = await fundMe.fund({ value: sendValue });
        await fundTxResponse.wait(1);
        const withdrawTxResponse = await fundMe.withdraw();
        await withdrawTxResponse.wait(1);
        const endingBalance = await fundMe.provider.getBalance(fundMe.address);
        assert.equal(endingBalance.toString, "0");
      });
    });
