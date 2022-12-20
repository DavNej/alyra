const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let Bank
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
    await deployments.fixture(['bank'])
    Bank = await ethers.getContract('Bank')
  })

  async function deposit(value, { account } = {}) {
    const tx = account
      ? await Bank.connect(account).deposit({ value })
      : await Bank.deposit({ value })

    expect(tx).to.changeEtherBalance(
      _deployer.address,
      _deployerInitialEtherBalance - value
    )
    expect(tx).to.emit('etherDeposited').withArgs(_deployer.address, value)
  }

  describe('Units tests for smart contract Bank', () => {
    it('Deploy contract', async () => {
      assert.exists(Bank.deployed())
    })

    describe('deposit', async () => {
      it('Revert when deposit is less than 100 wei', async () => {
        await expect(Bank.deposit({ value: 50 })).to.be.revertedWith(
          'Minimum deposit is 100 wei'
        )
      })

      it('Succeed when deposit is 100 wei', async () => {
        await deposit(100)
      })

      it('Succeed when deposit is greater than 100 wei', async () => {
        await deposit(1000)
      })
    })

    describe('getBalanceAndLastDeposit', async () => {
      it('Return balance and lastDeposit of account with NO funds', async () => {
        const tx = await Bank.connect(_user1).getBalanceAndLastDeposit()
        assert.equal(tx.balance.toString(), '0')
        assert.equal(tx.lastDeposit.toString(), '0')
      })

      it('Return balance and lastDeposit of account with funds', async () => {
        await deposit(1000, { account: _user2 })

        const tx = await Bank.connect(_user2).getBalanceAndLastDeposit()
        assert.equal(tx.balance.toString(), '1000')
        assert.equal(tx.lastDeposit.toString().indexOf('167'), 0)
      })
    })

    describe('withdraw', async () => {
      it('Revert when amount is less than 100 wei', async () => {
        const withdrawAmount = 52
        await expect(Bank.withdraw(withdrawAmount)).to.be.revertedWith(
          'Minimum amount to withdraw is 100 wei'
        )
      })
      it('Revert when amount is less than account balance', async () => {
        const withdrawAmount = 100000
        await expect(Bank.withdraw(withdrawAmount)).to.be.revertedWith(
          'Unsufficient funds'
        )
      })

      it('Succeed when withdraw is 100 wei', async () => {
        const withdrawAmount = 100
        const tx = Bank.withdraw(withdrawAmount)

        expect(tx).to.changeEtherBalance(
          _deployer.address,
          _deployerInitialEtherBalance + withdrawAmount
        )

        expect(tx)
          .to.emit('etherWithdrawn')
          .withArgs(_deployer.address, withdrawAmount)
      })

      it('Succeed when withdraw is greater than 100 wei', async () => {
        const withdrawAmount = 1000
        const tx = Bank.withdraw(withdrawAmount)

        expect(tx).to.changeEtherBalance(
          _deployer.address,
          _deployerInitialEtherBalance + withdrawAmount
        )

        expect(tx)
          .to.emit('etherWithdrawn')
          .withArgs(_deployer.address, withdrawAmount)
      })
    })
  })
}
