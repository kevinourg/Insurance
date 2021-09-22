const { ethers, upgrades } = require("hardhat");

async function main() {

  const InsurancePool = await ethers.getContractFactory("InsurancePool");
  const insurancePool = await upgrades.deployProxy(InsurancePool);
  await insurancePool.deployed();

  console.log("InsurancePool deployed to:", insurancePool.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
