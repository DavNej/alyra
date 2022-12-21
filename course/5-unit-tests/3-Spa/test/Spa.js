const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let spa
  let _deployer
  let _user1
  let _user2
  let _deployerInitialEtherBalance

  const elephant = {
    race: 'elephant',
    size: 230,
    age: 18,
  }
  const dog = {
    race: 'dog',
    size: 70,
    age: 5,
  }
  const cat = {
    race: 'cat',
    size: 50,
    age: 3,
  }

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

  describe('addAnimal', () => {
    it('Reverts if race is NOT specified', async () => {
      await expect(
        spa.addAnimal(elephant.age, '', elephant.size)
      ).to.be.revertedWith('Race must be specified')
    })

    it('Reverts if size is 0', async () => {
      await expect(
        spa.addAnimal(elephant.age, elephant.race, 0)
      ).to.be.revertedWith('Size must be greater than 0')
    })

    it('Adds an animal', async () => {
      const tx = await spa.addAnimal(elephant.age, elephant.race, elephant.size)
      expect(tx).to.emit('animalAdded').withArgs(0)
    })
  })

  describe('animalExists modifer', () => {
    beforeEach(async () => {
      await spa.addAnimal(elephant.age, elephant.race, elephant.size)
      await spa.addAnimal(dog.age, dog.race, dog.size)
      await spa.addAnimal(cat.age, cat.race, cat.size)
    })

    it('getAnimal', async () => {
      await expect(spa.getAnimal(3)).to.be.revertedWith('Id not registered')

      const deletedAnimalId = 1
      const tx = await spa.deleteAnimal(deletedAnimalId)
      tx.wait(1)

      await expect(spa.getAnimal(deletedAnimalId)).to.be.revertedWith(
        'Animal was deleted'
      )
    })

    it('deleteAnimal', async () => {
      await expect(spa.deleteAnimal(3)).to.be.revertedWith('Id not registered')

      const deletedAnimalId = 1
      const tx = await spa.deleteAnimal(deletedAnimalId)
      tx.wait(1)

      await expect(spa.deleteAnimal(deletedAnimalId)).to.be.revertedWith(
        'Animal was deleted'
      )
    })

    it('adoptAnimal', async () => {
      await expect(spa.adoptAnimal(3)).to.be.revertedWith('Id not registered')

      const deletedAnimalId = 1
      const tx = await spa.deleteAnimal(deletedAnimalId)
      tx.wait(1)

      await expect(spa.adoptAnimal(deletedAnimalId)).to.be.revertedWith(
        'Animal was deleted'
      )
    })
  })

  describe.skip('checkAnimalProps modifer', () => {
    it('', async () => {})
  })

  describe.skip('getAnimal', () => {
    it('', async () => {})
  })

  describe.skip('set', () => {
    it('', async () => {})
  })

  describe.skip('remove', () => {
    it('', async () => {})
  })

  describe.skip('adopt', () => {
    it('', async () => {})
  })

  describe.skip('getAdoption', () => {
    it('', async () => {})
  })

  describe.skip('adoptIfMax', () => {
    it('', async () => {})
  })
}
