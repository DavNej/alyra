const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let voting
  let _owner
  let _user1
  let _user2
  let _user3

  const WorkflowStatus = {
    RegisteringVoters: 0,
    ProposalsRegistrationStarted: 1,
    ProposalsRegistrationEnded: 2,
    VotingSessionStarted: 3,
    VotingSessionEnded: 4,
    VotesTallied: 5,
  }

  before(async () => {
    const accounts = await ethers.getSigners()
    _owner = accounts[0]
    _user1 = accounts[1]
    _user2 = accounts[2]
    _user3 = accounts[3]
  })

  beforeEach(async () => {
    await deployments.fixture(['voting'])
    voting = await ethers.getContract('Voting')
  })

  describe('Contract deployment', () => {
    it('Deploy contract and set deployer as the owner', async () => {
      assert.exists(voting.deployed())
    })
    it('Set the deployer as the owner', async () => {
      assert.equal(await voting.owner(), _owner.address)
    })
    it('Set the first status to "RegisteringVoters"', async () => {
      assert.equal(currentStatus, WorkflowStatus.RegisteringVoters)
    })
  })
  })
}
