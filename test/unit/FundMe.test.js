const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("FundMe", async function() {
      let fundMe;
      let deployer;
      let mockV3Aggregator;
      const sendValue = ethers.utils.parseEther("1");

      beforeEach(async function() {
        // deploy all the contract
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        mockV3Aggregator = await ethers.getContract(
          "MockV3Aggregator",
          deployer
        );
        fundMe = await ethers.getContract("FundMe", deployer);
      });

      describe("constructor", async function() {
        it("set the aggregator correctly", async function() {
          const response = await fundMe.getPriceFeed();
          assert.equal(mockV3Aggregator.address, response);
        });
      });

      describe("fund", async function() {
        it("fail to send eth", async function() {
          await expect(fundMe.fund()).to.be.revertedWith(
            "You need to spend more ETH!"
          );
        });
        it("updated the data", async () => {
          await fundMe.fund({ value: sendValue });
          const response = await fundMe.getFundedByAddress(deployer);
          assert.equal(response.toString(), sendValue.toString());
        });

        it("add funder to the array", async () => {
          await fundMe.fund({ value: sendValue });
          const funder = await fundMe.getFunder(0);
          assert.equal(deployer, funder);
        });
      });

      describe("withdraw", async function() {
        beforeEach(async () => {
          await fundMe.fund({ value: sendValue });
        });
        it("withdraw with a single funder", async () => {
          // arrange
          const startContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // act:
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingContractBalance, "0");
          assert.equal(
            startDeployerBalance.add(startContractBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });

        it("cheaperWithdraw with a single funder", async () => {
          // arrange
          const startContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // act:
          const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingContractBalance, "0");
          assert.equal(
            startDeployerBalance.add(startContractBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );
        });

        it("withdraw with a multiple funder", async () => {
          // arrage
          const accounts = await ethers.getSigners();
          for (let index = 0; index <= 6; index++) {
            const fundMeContract = await fundMe.connect(accounts[index]);
            await fundMeContract.fund({ value: sendValue });
          }

          const startContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // act
          const transactionResponse = await fundMe.withdraw();
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingContractBalance, "0");
          assert.equal(
            startDeployerBalance.add(startContractBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );

          expect(fundMe.getFunder(0)).to.be.reverted;
          for (let index = 0; index <= 6; index++) {
            assert(
              await fundMe.getFundedByAddress(accounts[index].address),
              "0"
            );
          }
        });
        it("only owner can be withdraw", async () => {
          const counts = await ethers.getSigners();
          const attacker = counts[1];
          const attackerContract = fundMe.connect(attacker);
          expect(await attackerContract.withdraw()).to.be.reverted;
        });
        it("cheaper withdraw with a multiple funder", async () => {
          // arrage
          const accounts = await ethers.getSigners();
          for (let index = 0; index <= 6; index++) {
            const fundMeContract = await fundMe.connect(accounts[index]);
            await fundMeContract.fund({ value: sendValue });
          }

          const startContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const startDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // act
          const transactionResponse = await fundMe.cheaperWithdraw();
          const transactionReceipt = await transactionResponse.wait();
          const { gasUsed, effectiveGasPrice } = transactionReceipt;
          const gasCost = gasUsed.mul(effectiveGasPrice);
          const endingContractBalance = await fundMe.provider.getBalance(
            fundMe.address
          );
          const endingDeployerBalance = await fundMe.provider.getBalance(
            deployer
          );

          // assert
          assert.equal(endingContractBalance, "0");
          assert.equal(
            startDeployerBalance.add(startContractBalance).toString(),
            endingDeployerBalance.add(gasCost).toString()
          );

          expect(fundMe.getFunder(0)).to.be.reverted;
          for (let index = 0; index <= 6; index++) {
            assert(
              await fundMe.getFundedByAddress(accounts[index].address),
              "0"
            );
          }
        });
      }); //fund
    }); //fundme
