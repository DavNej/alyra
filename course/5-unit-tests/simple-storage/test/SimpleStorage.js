const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')

!developmentChains.includes(network.name)
  ? describe.skip
  : describe('Units tests for smart contract SimpleStorage', function () {
      let accounts
      let simpleStorage
      before(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
      })

      it('should deploy the smart contract', async function () {
        await deployments.fixture(['simple-storage'])
        simpleStorage = await ethers.getContract('Storage')
      })

      it('Should retrieve the number and the number should be equal to 0', async function () {
        let number = await simpleStorage.retrieve()
        assert(number.toString() === '0')
      })

      it('should store the number', async function () {
        await simpleStorage.store(5)
        let number = await simpleStorage.retrieve()
        assert.equal(number.toString(), '5')
      })
    })
