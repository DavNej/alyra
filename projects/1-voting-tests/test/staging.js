const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { WorkflowStatus, proposals } = require('./utils')

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

  describe('Staging', async () => {
    it('Goes through the whole process', async () => {
      await deployments.fixture(['voting'])
      voting = await ethers.getContract('Voting')

      assert.exists(voting.deployed())
      assert.equal(await voting.owner(), owner.address)
      const currentStatus = await voting.workflowStatus()
      assert.equal(currentStatus, WorkflowStatus.RegisteringVoters)

      const addVoterTx1 = await voting.addVoter(user1.address)
      addVoterTx1.wait(1)
      expect(addVoterTx1).to.emit('VoterRegistered').withArgs(user1.address)
      const addVoterTx2 = await voting.addVoter(user2.address)
      addVoterTx2.wait(1)
      expect(addVoterTx2).to.emit('VoterRegistered').withArgs(user2.address)
      const addVoterTx3 = await voting.addVoter(user3.address)
      addVoterTx3.wait(1)
      expect(addVoterTx3).to.emit('VoterRegistered').withArgs(user3.address)

      const startProposalsRegisteringTx =
        await voting.startProposalsRegistering()
      startProposalsRegisteringTx.wait(1)
      expect(startProposalsRegisteringTx)
        .to.emit('WorkflowStatusChange')
        .withArgs(
          WorkflowStatus.RegisteringVoters,
          WorkflowStatus.ProposalsRegistrationStarted
        )

      const propTx1 = await voting
        .connect(user1)
        .addProposal(proposals[1].description)
      propTx1.wait(1)
      expect(propTx1).to.emit('ProposalRegistered').withArgs(1)
      const propTx2 = await voting
        .connect(user2)
        .addProposal(proposals[2].description)
      propTx2.wait(1)
      expect(propTx2).to.emit('ProposalRegistered').withArgs(2)
      const propTx3 = await voting
        .connect(user3)
        .addProposal(proposals[3].description)
      propTx3.wait(1)
      expect(propTx3).to.emit('ProposalRegistered').withArgs(3)

      const endProposalsRegisteringTx = await voting.endProposalsRegistering()
      endProposalsRegisteringTx.wait(1)
      expect(endProposalsRegisteringTx)
        .to.emit('WorkflowStatusChange')
        .withArgs(
          WorkflowStatus.ProposalsRegistrationStarted,
          WorkflowStatus.ProposalsRegistrationEnded
        )

      const startVotingSessionTx = await voting.startVotingSession()
      startVotingSessionTx.wait(1)
      expect(startVotingSessionTx)
        .to.emit('WorkflowStatusChange')
        .withArgs(
          WorkflowStatus.ProposalsRegistrationEnded,
          WorkflowStatus.VotingSessionStarted
        )

      const proposalIdToVoteFor = 1

      const voteTx1 = await voting.connect(user1).setVote(proposalIdToVoteFor)
      voteTx1.wait(1)
      expect(voteTx1)
        .to.emit('Voted')
        .withArgs(user1.address, proposalIdToVoteFor)
      const voteTx2 = await voting.connect(user2).setVote(proposalIdToVoteFor)
      voteTx2.wait(1)
      expect(voteTx2)
        .to.emit('Voted')
        .withArgs(user1.address, proposalIdToVoteFor)
      const voteTx3 = await voting.connect(user3).setVote(2)
      voteTx3.wait(1)
      expect(voteTx3).to.emit('Voted').withArgs(user1.address, 2)

      const endVotingSessionTx = await voting.endVotingSession()
      expect(endVotingSessionTx)
        .to.emit('WorkflowStatusChange')
        .withArgs(
          WorkflowStatus.VotingSessionStarted,
          WorkflowStatus.VotingSessionEnded
        )

      const votesTalliedTx = await voting.tallyVotes()
      votesTalliedTx.wait(1)

      expect(votesTalliedTx)
        .to.emit('WorkflowStatusChange')
        .withArgs(
          WorkflowStatus.VotingSessionEnded,
          WorkflowStatus.VotesTallied
        )

      const winningProposalId = await voting.winningProposalID()

      assert.equal(winningProposalId, proposalIdToVoteFor)
    })
  })
}
