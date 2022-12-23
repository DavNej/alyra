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
  describe('Voter functions', () => {
    describe('addVoter', () => {
      it('Register a new voter', async () => {
        const tx = await voting.addVoter(_user1.address)
        tx.wait(1)

        const voter = await voting
          .connect(_user1.address)
          .getVoter(_user1.address)

        assert.equal(voter.isRegistered, true)
        assert.equal(voter.hasVoted, false)
        assert.equal(voter.votedProposalId.toString(), '0')

        expect(tx).to.emit('VoterRegistered').withArgs(_user1.address)
      })

      it("Can't register a voter already in the list", async () => {
        await voting.addVoter(_user1.address)
        await expect(voting.addVoter(_user1.address)).to.be.revertedWith(
          'Already registered'
        )
      })

      describe("Can't register if NOT in 'RegisteringVoters' status", () => {
        afterEach(async () => {
          await expect(voting.addVoter(_user1.address)).to.be.revertedWith(
            'Voters registration is not open yet'
          )
        })

        it("'ProposalsRegistrationStarted' status", async () => {
          await voting.startProposalsRegistering()
  })
        it("'ProposalsRegistrationEnded' status", async () => {
          await voting.startProposalsRegistering()
          await voting.endProposalsRegistering()
        })
        it("'VotingSessionStarted' status", async () => {
          await voting.startProposalsRegistering()
          await voting.endProposalsRegistering()
          await voting.startVotingSession()
        })
        it("'VotingSessionEnded' status", async () => {
          await voting.startProposalsRegistering()
          await voting.endProposalsRegistering()
          await voting.startVotingSession()
          await voting.endVotingSession()
        })

        // no function to set status to 'VotesTallied' 🤷
      })
    })

    describe('getVoter', () => {
      beforeEach(async () => {
        await voting.addVoter(_user1.address)
        await voting.addVoter(_user2.address)
        await voting.addVoter(_user3.address)
  })

      it('Retrieve own voter info', async () => {
        const voter = await voting
          .connect(_user1.address)
          .getVoter(_user1.address)

        assert.equal(voter.isRegistered, true)
        assert.equal(voter.hasVoted, false)
        assert.equal(voter.votedProposalId.toString(), '0')
      })

      it("Retrieve another voter's info", async () => {
        const voter = await voting
          .connect(_user1.address)
          .getVoter(_user2.address)

        assert.equal(voter.isRegistered, true)
        assert.equal(voter.hasVoted, false)
        assert.equal(voter.votedProposalId.toString(), '0')
      })
    })
  })
}
