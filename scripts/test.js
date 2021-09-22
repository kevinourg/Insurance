const hre = require("hardhat");

const contractAddr = "0x8eEc1B5424909cF91C6b91626B31F0481A08fd72 "

async function main() {

  const value = ethers.utils.parseEther('0.1');
  const insurancePool = await ethers.getContractAt("InsurancePool", contractAddr);
  const tx = await insurancePool.deposit({ value });
  await tx.wait();

  console.log("Deposit to InsurancePool", ethers.utils.formatEther(value).toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
