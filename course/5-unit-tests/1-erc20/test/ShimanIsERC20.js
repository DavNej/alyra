const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let Shiman
  let owner
  let notOwner
  const initialBalance = ethers.utils.parseEther('1000000')

  before(async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[0]
    notOwner = accounts[1]
  })

  describe('Units tests for smart contract ShimanIsERC20', () => {
    describe('Constructor', () => {
      beforeEach(async () => {
        await deployments.fixture(['shiman'])
        Shiman = await ethers.getContract('ShimanIsERC20')
      })
      it('Deploy contract and mint initial Balance to owner', async () => {
        Shiman = await ethers.getContract('ShimanIsERC20')
        assert.exists(Shiman.deployed())

        let ownerBalance = await Shiman.balanceOf(owner.address)
        expect(ownerBalance).eq(initialBalance)
        /*
        Other methods

        const INITIAL_BALANCE = '1000000000000000000000000'
        assert(ownerBalance.toString() === INITIAL_BALANCE)

        const INITIAL_BALANCE = ethers.BigNumber.from('1000000000000000000000000')
        expect(ownerBalance).eq(INITIAL_BALANCE)
        */
      })

      it('contract has good name and symbol', async () => {
        const tokenName = await Shiman.name()
        const tokenSymbol = await Shiman.symbol()

        assert.equal(tokenName, 'Shiman')
        assert.equal(tokenSymbol, 'SHIM')
      })
    })

    describe('Mint', () => {
      beforeEach(async () => {
        await deployments.fixture(['shiman'])
        Shiman = await ethers.getContract('ShimanIsERC20')
      })
      const amountToMint = 100

      it('Can mint if owner', async () => {
        await Shiman.mint(owner.address, amountToMint)
        const ownerBalance = await Shiman.balanceOf(owner.address)
        const newBalance = ethers.BigNumber.from(initialBalance.toString()).add(
          amountToMint
        )
        assert.equal(ownerBalance.toString(), newBalance.toString())
      })

      it('Can NOT mint if NOT owner', async () => {
        await expect(
          Shiman.connect(notOwner).mint(notOwner.address, amountToMint)
        ).to.be.revertedWith('Ownable: caller is not the owner')
      })
    })
  })
}
