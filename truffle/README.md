# Truffle

## First smart contract deployment

1. Compile contract with `truffle compile`
2. Run `ganache` in another terminal
3. Create migration script `migrations/1_deploy.js`
4. Run `truffle deploy`
5. Run `truffle console` then

```javascript
var instance = await Storage.deployed()
await instance.store(18)
await instance.retrieve()
```

## Deploy on Goerli

1. Install `@truffle/hdwallet-provider`
2. Get RPC URL for Görli testnet (here, done with Infura)
3. Install `dotenv` and add the RPC URL and the wallet private key to `.env`
4. Add `goerli` in `truffle-config.js` in `networks`
5. Run migration with `truffle migrate --network goerli`

Output:

```
1_deploy.js
===========

   Deploying 'Storage'
   -------------------
   > transaction hash:    0xbb6fb1b6415983ec30eb03a5445d6c845332512d81803330bd4f734a4e584fcf
   > Blocks: 1            Seconds: 16
   > contract address:    0xE803d52aaD5199FaD1b4E4e9bf39CC22c2079a69
   > block number:        8121613
   > block timestamp:     1670841684
   > account:             0xA22DEC1827c6564A356cCa512dd955D225De1674
   > balance:             1.994546852430855428
   > gas used:            125677 (0x1eaed)
   > gas price:           13.246832146 gwei
   > value sent:          0 ETH
   > total cost:          0.001664822123612842 ETH

   > Saving artifacts
   -------------------------------------
   > Total cost:     0.001664822123612842 ETH

Summary
=======
> Total deployments:   1
> Final cost:          0.001664822123612842 ETH

```

6. Check tx hash on [goerli.etherscan](https://goerli.etherscan.io)
7. Run `truffle console --network goerli`, then run

```javascript
await web3.eth.getAccounts()
await web3.eth.getBalance('0xA22DEC1827c6564A356cCa512dd955D225De1674')

var instance = await Storage.deployed()
await instance.store(18)
await instance.retrieve()
```
