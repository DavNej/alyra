const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let Bank
  let _deployer
  let _user

  before(async () => {
    const accounts = await ethers.getSigners()
    _deployer = accounts[0]
    _user = accounts[1]
    await deployments.fixture(['bank'])
  })

  describe('Units tests for smart contract Bank', () => {
    it('Deploy contract', async () => {
      Bank = await ethers.getContract('Bank')
      assert.exists(Bank.deployed())
    })
  })

  describe.only('deposit', async () => {
    it('Revert when deposit is less than 100 wei', async () => {
      const tx = await Bank.deposit(50)
      expect(tx).to.be.revertedWith('Minimum deposit is 100 wei')
      expect(tx).not.to.emit('etherDeposited')
    })
    it('Succeed when deposit is 100 wei', async () => {
      // deposit(100)
      // deposit success
      // event emited
    })
    it('Succeed when deposit is greater than 100 wei', async () => {
      // deposit(1000)
      // deposit success
      // event emited
    })
  })

  describe('getBalanceAndLastDeposit', async () => {
    it('Return balance and lastDeposit of account with NO funds', async () => {
      // getBalanceAndLastDeposit()
      // return
    })

    it('Return balance and lastDeposit of account with funds', async () => {
      // getBalanceAndLastDeposit()
      // return 0, 0
    })
  })

  describe('withdraw', async () => {
    it('Revert when amount is less than 100 wei', async () => {
      // withdraw(50)
      // reverts with message
      // event not emited
    })
    it('Revert when amount is less than account balance', async () => {
      // withdraw(1000)
      // reverts with message
      // event not emited
    })
    it('Succeed when withdraw is 100 wei', async () => {
      // withdraw(100)
      // withdraw success
      // event emited
    })
    it('Succeed when withdraw is greater than 100 wei', async () => {
      // withdraw(1000)
      // withdraw success
      // event emited
    })
  })
}
