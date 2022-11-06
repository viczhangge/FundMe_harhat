const { run } = require("hardhat");

async function verify(contracAddress, args) {
  console.log("verifing the contract");

  try {
    await run("verify:verify", {
      address: contracAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(e);
    }
  }
}

module.exports = { verify };
