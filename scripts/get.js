const { ethers } = require("hardhat");

const contractAddr = "0xd9fb943bc23D1a72D90D48fE12D8996Ee7F7acaE"

async function main() {

  const value = ethers.utils.parseEther('0.1');
  const insurancePool = await ethers.getContractAt("InsurancePool", contractAddr);

  const mybalance = await insurancePool.getMyBalance();
  console.log("My balance is", ethers.utils.formatEther(mybalance).toString(), "ETH");

  const contractBalance = await insurancePool.getContractBalance();
  console.log("Contract balance is", ethers.utils.formatEther(contractBalance).toString());

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
