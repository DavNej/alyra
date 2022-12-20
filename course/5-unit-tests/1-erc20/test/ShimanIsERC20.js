const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let Shiman
  let _owner
  let _notOwner
  const _initialBalance = ethers.utils.parseEther('1000000')

  before(async () => {
    const accounts = await ethers.getSigners()
    _owner = accounts[0]
    _notOwner = accounts[1]
    await deployments.fixture(['shiman'])
  })

  describe('Units tests for smart contract ShimanIsERC20', () => {
    describe('Constructor', () => {
      it('Deploy contract and mint initial Balance to _owner', async () => {
        Shiman = await ethers.getContract('ShimanIsERC20')
        assert.exists(Shiman.deployed())

        let balanceOfDeployer = await Shiman.balanceOf(_owner.address)
        expect(balanceOfDeployer).eq(_initialBalance)

        // const INITIAL_BALANCE = '1000000000000000000000000'
        // assert(balanceOfDeployer.toString() === INITIAL_BALANCE)

        // const INITIAL_BALANCE = ethers.BigNumber.from('1000000000000000000000000')
        // expect(balanceOfDeployer).eq(INITIAL_BALANCE)
      })

      it('contract has good name and symbol', async () => {
        const tokenName = await Shiman.name()
        const tokenSymbol = await Shiman.symbol()

        assert.equal(tokenName, 'Shiman')
        assert.equal(tokenSymbol, 'SHIM')
      })
    })

  })
}

