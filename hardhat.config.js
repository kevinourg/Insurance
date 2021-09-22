require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');
require('dotenv').config();

module.exports = {
  solidity: "0.8.2",
  paths: {
    artifacts: "./app/artifacts",
  },
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
    rinkeby2: {
      url: process.env.RINKEBY_URL,
      accounts: [process.env.PRIVATE_KEY2],
    },
  },
  etherscan: {
  apiKey: "V6A3QQVN6HZKDHTNGM1S3KWH9XQJEZ68TT"
  }
};
