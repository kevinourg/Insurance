const { ethers, upgrades } = require("hardhat");

const contractAddr ="";

async function main() {

  const InsurancePool = await ethers.getContractFactory("InsurancePool");
  await upgrades.upgradeProxy(InsurancePool);

  console.log("InsurancePool has ben upgraded to:", insurancePool.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
