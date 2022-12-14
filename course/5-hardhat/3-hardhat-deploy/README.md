# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```

## Hardhat deploy

* Run `yarn hardhat node` to launch local blockchain and deploy the contract (`yarn hardhat node --no-deploy` to launch without deploying)

* Run `yarn hardhat deploy --network <network>` to deploy a contract on `<network>`

Something weird => to make `ethers.getContract` => 

```
yarn add --dev hardhat @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers
```

```
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers
```

Run `yarn hardhat run ./scripts/<script> --network <network>`
