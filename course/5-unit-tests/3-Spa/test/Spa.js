const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let spa
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
    await deployments.fixture(['spa'])
    spa = await ethers.getContract('Spa')
  })

  describe('Contract deployment', () => {
    it('Deploy contract', async () => {
      assert.exists(spa.deployed())
    })
  })

  describe('add', () => {
    const animal = {
      race: 'Dog',
      size: 70,
      age: 3,
    }

    it('Reverts if age is 0', async () => {
      await expect(spa.add(animal.race, animal.size, 0)).to.be.revertedWith(
        'Age must be greater than 0'
      )
    })

    it('Reverts if size is 0', async () => {
      await expect(spa.add(animal.race, 0, animal.age)).to.be.revertedWith(
        'Size must be greater than 0'
      )
    })

    it('Adds an animals', async () => {
      const tx = await spa.add(animal.race, animal.size, animal.age)
      expect(tx).to.emit('animalAdded').withArgs(0)
    })
  })
}
