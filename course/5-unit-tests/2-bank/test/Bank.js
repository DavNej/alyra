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

  async function deposit(value) {
    const tx = await Bank.deposit({ value })
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
        //? est ce qu'une transaction reverted emeet un EVENT ?
        // .not.to.emit('etherDeposited')
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
        await Bank.connect(_user2)
        await deposit(1000)

        const tx = await Bank.getBalanceAndLastDeposit()

        assert.equal(tx.balance.toString(), '1000')
        assert.equal(tx.lastDeposit.toString().indexOf('167'), 0)
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
  })
}
