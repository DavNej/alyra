const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { setWorkflowStatus } = require('./utils')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let voting
  let _owner
  let _user1
  let _user2
  let _user3

  const proposal1 = 'Peace on earth'
  const proposal2 = 'Be happy'
  const proposal3 = 'Educate ourselves'

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
      const currentStatus = await voting.workflowStatus()
      assert.equal(currentStatus, WorkflowStatus.RegisteringVoters)
    })
  })

  describe('WorkflowStatus functions', () => {
    beforeEach(async () => {
      await voting.addVoter(_user1.address)
    })

    it('startProposalsRegistering successfuly', async () => {
        const tx = await voting.startProposalsRegistering()
        tx.wait(1)

        const newStatus = await voting.workflowStatus()
        assert.equal(newStatus, WorkflowStatus.ProposalsRegistrationStarted)

        const genesisProposal = await voting.connect(_user1).getOneProposal(0)
        assert.equal(genesisProposal.description, 'GENESIS')
        assert.equal(genesisProposal.voteCount.toString(), '0')

        expect(tx)
          .to.emit('WorkflowStatusChange')
          .withArgs(
            WorkflowStatus.RegisteringVoters,
            WorkflowStatus.ProposalsRegistrationStarted
          )
      })

    it('endProposalsRegistering successfuly', async () => {
        await setWorkflowStatus(voting, 'ProposalsRegistrationStarted')

        const tx = await voting.endProposalsRegistering()
        tx.wait(1)

        const newStatus = await voting.workflowStatus()
        assert.equal(newStatus, WorkflowStatus.ProposalsRegistrationEnded)

        expect(tx)
          .to.emit('WorkflowStatusChange')
          .withArgs(
            WorkflowStatus.ProposalsRegistrationStarted,
            WorkflowStatus.ProposalsRegistrationEnded
          )
      })

    it('startVotingSession successfuly', async () => {
        await voting.startProposalsRegistering()
        await voting.endProposalsRegistering()

        const tx = await voting.startVotingSession()
        tx.wait(1)

        const newStatus = await voting.workflowStatus()
        assert.equal(newStatus, WorkflowStatus.VotingSessionStarted)

        expect(tx)
          .to.emit('WorkflowStatusChange')
          .withArgs(
            WorkflowStatus.ProposalsRegistrationEnded,
            WorkflowStatus.VotingSessionStarted
          )
      })

    it('endVotingSession successfuly', async () => {
        await voting.startProposalsRegistering()
        await voting.endProposalsRegistering()
        await voting.startVotingSession()

        const tx = await voting.endVotingSession()
        tx.wait(1)

        const newStatus = await voting.workflowStatus()
        assert.equal(newStatus, WorkflowStatus.VotingSessionEnded)

        expect(tx)
          .to.emit('WorkflowStatusChange')
          .withArgs(
            WorkflowStatus.VotingSessionStarted,
            WorkflowStatus.VotingSessionEnded
          )
    })
  })

  describe('Voter functions', () => {
    describe('addVoter', () => {
      it('Register a new voter', async () => {
        const tx = await voting.addVoter(_user1.address)
        tx.wait(1)

        const voter = await voting.connect(_user1).getVoter(_user1.address)

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
    })

    describe('getVoter', () => {
      beforeEach(async () => {
        await voting.addVoter(_user1.address)
        await voting.addVoter(_user2.address)
  })

      it("Retrieve voter's own info", async () => {
        const voter = await voting.connect(_user1).getVoter(_user1.address)

        assert.equal(voter.isRegistered, true)
        assert.equal(voter.hasVoted, false)
        assert.equal(voter.votedProposalId.toString(), '0')
      })

      it("Retrieve another voter's info", async () => {
        const voter = await voting.connect(_user1).getVoter(_user2.address)

        assert.equal(voter.isRegistered, true)
        assert.equal(voter.hasVoted, false)
        assert.equal(voter.votedProposalId.toString(), '0')
      })
    })
  })

  describe('Proposals functions', () => {
    beforeEach(async () => {
      await voting.addVoter(_user1.address)
      await setWorkflowStatus(voting, 'ProposalsRegistrationStarted')
    })

    describe('addProposal', () => {
    it('Add a new proposal', async () => {
      const tx = await voting.connect(_user1).addProposal(proposal1)
      tx.wait(1)

      const expectedProposalId = 1

      const proposal = await voting
        .connect(_user1)
        .getOneProposal(expectedProposalId)

      assert.equal(proposal.description, proposal1)

      expect(tx).to.emit('ProposalRegistered').withArgs(expectedProposalId)
    })

    it("Can't to add an empty proposal", async () => {
      await expect(voting.connect(_user1).addProposal('')).to.be.revertedWith(
        'Vous ne pouvez pas ne rien proposer'
      )
      })
    })
    })
  })
}
