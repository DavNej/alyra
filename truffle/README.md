# Truffle

## First smart contract deployment

Compile contract

```
truffle compile
```

Run ganache in another terminal

```
ganache
```

Create migration script `1_deploy.js` in migrations

```
truffle deploy
```

Run truffle console

```
truffle console
```

then

```javascript
var instance = await Storage.deployed()
await instance.store(18)
await instance.retrieve()
```
