const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let voting
  let _deployer
  let _user1
  let _user2

  before(async () => {
    const accounts = await ethers.getSigners()
    _deployer = accounts[0]
    _user1 = accounts[1]
    _user2 = accounts[2]
  })

  beforeEach(async () => {
    await deployments.fixture(['voting'])
    voting = await ethers.getContract('Voting')
  })

  describe('Contract deployment', () => {
    it('Deploy contract', async () => {
      assert.exists(voting.deployed())
    })
  })
}
