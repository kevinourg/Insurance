### X-PROTOCOL-I

The project is in development.

## React App
You'll need Node/NPM for running installing dependencies and running your app

## Starting the Application
To start the react application, open up a terminal and find your way into the protocol folder.

Once you're there run:

`npm install` to install dependencies then `npm start` to run the application.

Once you've done that, installing metamask will allow you to deploy the protocol create escrow contracts on your own local node or a public testnet like Rinkeby or Kovan.

## Run tests cases

`npx hardhat test` to run tests cases, if they all passed, the application is ready to be deployed.

## Deploy scripts

To deploy the contract, `npx hardhat run scripts/deploy.js --network CHOOSE_NETWORK`

## Run Front-end

To run front-end, `parcel app/index.html`

## Shell commands

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
