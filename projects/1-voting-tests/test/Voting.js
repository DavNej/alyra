const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { setWorkflowStatus, WorkflowStatus, proposals } = require('./utils')

const { assert, expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let voting
  let owner
  let user1
  let user2
  let user3

  before(async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[0]
    user1 = accounts[1]
    user2 = accounts[2]
    user3 = accounts[3]
  })

  describe('Contract deployment', () => {
    beforeEach(async () => {
      await deployments.fixture(['voting'])
      voting = await ethers.getContract('Voting')
    })
    it('Deploy contract and set deployer as the owner', async () => {
      assert.exists(voting.deployed())
    })
    it('Set the deployer as the owner', async () => {
      assert.equal(await voting.owner(), owner.address)
    })
    it('Set the first status to "RegisteringVoters"', async () => {
      const currentStatus = await voting.workflowStatus()
      assert.equal(currentStatus, WorkflowStatus.RegisteringVoters)
    })
  })

  describe('WorkflowStatus functions', () => {
    beforeEach(async () => {
      await deployments.fixture(['voting'])
      voting = await ethers.getContract('Voting')
      await voting.addVoter(user1.address)
    })

    it('startProposalsRegistering successfuly', async () => {
      const tx = await voting.startProposalsRegistering()
      tx.wait(1)

      const newStatus = await voting.workflowStatus()
      assert.equal(newStatus, WorkflowStatus.ProposalsRegistrationStarted)

      const proposal = await voting.connect(user1).getOneProposal(0)

      const genesisProposal = proposals[0]
      assert.equal(proposal.description, genesisProposal.description)
      assert.equal(
        proposal.voteCount.toString(),
        genesisProposal.voteCount.toString()
      )

      expect(tx)
        .to.emit('WorkflowStatusChange')
        .withArgs(
          WorkflowStatus.RegisteringVoters,
          WorkflowStatus.ProposalsRegistrationStarted
        )
    })

    it('endProposalsRegistering successfuly', async () => {
      await setWorkflowStatus(
        voting,
        WorkflowStatus.ProposalsRegistrationStarted
      )

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
      beforeEach(async () => {
        await deployments.fixture(['voting'])
        voting = await ethers.getContract('Voting')
      })

      it('Register a new voter', async () => {
        const tx = await voting.addVoter(user1.address)
        tx.wait(1)

        const voter = await voting.connect(user1).getVoter(user1.address)

        assert.equal(voter.isRegistered, true)
        assert.equal(voter.hasVoted, false)
        assert.equal(voter.votedProposalId.toString(), '0')

        expect(tx).to.emit('VoterRegistered').withArgs(user1.address)
      })

      it("Can't register a voter already in the list", async () => {
        await voting.addVoter(user1.address)
        await expect(voting.addVoter(user1.address)).to.be.revertedWith(
          'Already registered'
        )
      })
    })

    describe('getVoter', () => {
      beforeEach(async () => {
        await deployments.fixture(['voting'])
        voting = await ethers.getContract('Voting')
        await voting.addVoter(user1.address)
        await voting.addVoter(user2.address)
      })

      it("Retrieve voter's own info", async () => {
        const voter = await voting.connect(user1).getVoter(user1.address)

        assert.equal(voter.isRegistered, true)
        assert.equal(voter.hasVoted, false)
        assert.equal(voter.votedProposalId.toString(), '0')
      })

      it("Retrieve another voter's info", async () => {
        const voter = await voting.connect(user1).getVoter(user2.address)

        assert.equal(voter.isRegistered, true)
        assert.equal(voter.hasVoted, false)
        assert.equal(voter.votedProposalId.toString(), '0')
      })
    })
  })

  describe('Proposals functions', () => {
    describe('addProposal', () => {
      beforeEach(async () => {
        await deployments.fixture(['voting'])
        voting = await ethers.getContract('Voting')
        await voting.addVoter(user1.address)
        await setWorkflowStatus(
          voting,
          WorkflowStatus.ProposalsRegistrationStarted
        )
      })
      it('Add a new proposal', async () => {
        const proposalId = 1
        const proposal = proposals[proposalId]

        const tx = await voting.connect(user1).addProposal(proposal.description)
        tx.wait(1)

        const newProposal = await voting
          .connect(user1)
          .getOneProposal(proposalId)

        assert.equal(newProposal.description, proposal.description)

        expect(tx).to.emit('ProposalRegistered').withArgs(proposalId)
      })

      it("Can't to add an empty proposal", async () => {
        await expect(voting.connect(user1).addProposal('')).to.be.revertedWith(
          'Vous ne pouvez pas ne rien proposer'
        )
      })
    })

    describe('getOneProposal', () => {
      beforeEach(async () => {
        await deployments.fixture(['voting'])
        voting = await ethers.getContract('Voting')
        await voting.addVoter(user1.address)
        await voting.addVoter(user2.address)
        await voting.addVoter(user3.address)

        await setWorkflowStatus(
          voting,
          WorkflowStatus.ProposalsRegistrationStarted
        )

        await voting.connect(user1).addProposal(proposals[1].description)
        await voting.connect(user2).addProposal(proposals[2].description)
        await voting.connect(user3).addProposal(proposals[3].description)
      })

      it('Retrieve genesis proposal', async () => {
        const proposal = await voting.connect(user1).getOneProposal(0)
        assert.equal(proposal.description, proposals[0].description)
        assert.equal(proposal.voteCount.toString(), '0')
      })

      it("Retrieve voter's own proposal", async () => {
        const proposal = await voting.connect(user1).getOneProposal(1)
        assert.equal(proposal.description, proposals[1].description)
        assert.equal(proposal.voteCount.toString(), '0')
      })

      it("Retrieve another voter's proposal", async () => {
        const proposal = await voting.connect(user1).getOneProposal(2)
        assert.equal(proposal.description, proposals[2].description)
        assert.equal(proposal.voteCount.toString(), '0')
      })
    })
  })

  describe('Votes functions', () => {
    describe('setVote', () => {
      beforeEach(async () => {
        await deployments.fixture(['voting'])
        voting = await ethers.getContract('Voting')

        await voting.addVoter(user1.address)
        await voting.startProposalsRegistering()
        await voting.connect(user1).addProposal(proposals[1].description)

        await voting.endProposalsRegistering()
        await voting.startVotingSession()
      })

      it('Vote for a proposal', async () => {
        const proposalId = 1

        const voteTx = await voting.connect(user1).setVote(proposalId)
        voteTx.wait(1)

        expect(voteTx).to.emit('Voted').withArgs(user1.address, proposalId)

        const proposalRes = await voting
          .connect(user1)
          .getOneProposal(proposalId)
        assert.equal(proposalRes.voteCount.toString(), '1')

        const voterRes = await voting.connect(user1).getVoter(user1.address)
        assert.equal(voterRes.hasVoted, true)
        assert.equal(voterRes.votedProposalId.toString(), String(proposalId))
      })

      it("Can't vote for an unexisting proposal", async () => {
        const proposalId = 5

        await expect(
          voting.connect(user1).setVote(proposalId)
        ).to.be.revertedWith('Proposal not found')
      })

      it("Can't vote if voter already voted", async () => {
        const proposalId = 1

        const voteTx = await voting.connect(user1).setVote(proposalId)
        voteTx.wait(1)

        await expect(voting.connect(user1).setVote(2)).to.be.revertedWith(
          'You have already voted'
        )
      })
    })

    describe('tallyVotes', () => {
      const proposalIdToVoteFor = 1
      beforeEach(async () => {
        await deployments.fixture(['voting'])
        voting = await ethers.getContract('Voting')

        await voting.addVoter(user1.address)
        await voting.addVoter(user2.address)
        await voting.addVoter(user3.address)

        await voting.startProposalsRegistering()
        await voting.connect(user1).addProposal(proposals[1].description)
        await voting.connect(user2).addProposal(proposals[2].description)
        await voting.connect(user3).addProposal(proposals[3].description)
        await voting.endProposalsRegistering()

        await voting.startVotingSession()
        await voting.connect(user1).setVote(proposalIdToVoteFor)
        await voting.connect(user2).setVote(proposalIdToVoteFor)
        await voting.connect(user3).setVote(2)
        await voting.endVotingSession()
      })

      it('Tally votes successfuly', async () => {
        const tx = await voting.tallyVotes()
        tx.wait(1)

        const winningProposalId = await voting.winningProposalID()

        assert.equal(winningProposalId, proposalIdToVoteFor)

        expect(tx)
          .to.emit('WorkflowStatusChange')
          .withArgs(
            WorkflowStatus.VotingSessionEnded,
            WorkflowStatus.VotesTallied
          )
      })
    })
  })
}
