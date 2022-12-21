const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let bank
  let _deployer
  let _user1
  let _user2
  let _deployerInitialEtherBalance

  before(async () => {
    const accounts = await ethers.getSigners()
    _deployer = accounts[0]
    _deployerInitialEtherBalance = _deployer.getBalance()
    _user1 = accounts[1]
    _user2 = accounts[2]
  })

  beforeEach(async () => {
    await deployments.fixture(['bank'])
    bank = await ethers.getContract('Bank')
  })

  describe('Contract deployment', () => {
    it('Deploy contract', async () => {
      assert.exists(bank.deployed())
    })
  })

  describe('deposit', async () => {
    it('Revert when deposit is less than 100 wei', async () => {
      await expect(bank.deposit({ value: 50 })).to.be.revertedWith(
        'Minimum deposit is 100 wei'
      )
    })

    it('Succeed when deposit is 100 wei', async () => {
      const value = 100
      const tx = await bank.deposit({ value })

      expect(tx).to.changeEtherBalance(
        _deployer.address,
        _deployerInitialEtherBalance - value
      )

      expect(tx).to.emit('etherDeposited').withArgs(_deployer.address, value)
    })

    it('Succeed when deposit is greater than 100 wei', async () => {
      const value = 101
      const tx = await bank.deposit({ value })

      expect(tx).to.changeEtherBalance(
        _deployer.address,
        _deployerInitialEtherBalance - value
      )

      expect(tx).to.emit('etherDeposited').withArgs(_deployer.address, value)
    })
  })

  describe('getBalanceAndLastDeposit', async () => {
    beforeEach(async () => {
      await bank.deposit({ value: 1000 })
      await bank.connect(_user1).deposit({ value: 2000 })
    })

    it('Return balance and lastDeposit of account with NO funds', async () => {
      const results = await bank.connect(_user2).getBalanceAndLastDeposit()
      assert.equal(results.balance.toString(), '0')
      assert.equal(results.lastDeposit.toString(), '0')
    })

    it('Return balance and lastDeposit of account with funds', async () => {
      const results = await bank.connect(_user1).getBalanceAndLastDeposit()
      assert.equal(results.balance.toString(), '2000')
      assert.equal(results.lastDeposit.toString().indexOf('167'), 0)
    })
  })

  describe('withdraw', async () => {
    beforeEach(async () => {
      await bank.deposit({ value: 1000 })
      await bank.connect(_user1).deposit({ value: 2000 })
    })

    it('Revert when amount is less than 100 wei', async () => {
      const withdrawAmount = 52
      await expect(bank.withdraw(withdrawAmount)).to.be.revertedWith(
        'Minimum amount to withdraw is 100 wei'
      )
    })

    it('Revert when amount is less than account balance', async () => {
      const withdrawAmount = 100000
      await expect(bank.withdraw(withdrawAmount)).to.be.revertedWith(
        'Unsufficient funds'
      )
    })

    it('Succeed when withdraw is 100 wei', async () => {
      const withdrawAmount = 100
      const tx = await bank.withdraw(withdrawAmount)

      await tx.wait(1)

      expect(tx).to.changeEtherBalance(
        _deployer.address,
        _deployerInitialEtherBalance + withdrawAmount
      )

      expect(tx)
        .to.emit('etherWithdrawn')
        .withArgs(_deployer.address, withdrawAmount)
    })

    it('Succeed when withdraw is greater than 100 wei', async () => {
      const withdrawAmount = 101
      const tx = bank.withdraw(withdrawAmount)

      await tx.wait(1)

      expect(tx).to.changeEtherBalance(
        _deployer.address,
        _deployerInitialEtherBalance + withdrawAmount
      )

      expect(tx)
        .to.emit('etherWithdrawn')
        .withArgs(_deployer.address, withdrawAmount)
    })
  })
}
