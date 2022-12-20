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
}
