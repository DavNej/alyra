const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { proposals, setWorkflowStatus, WorkflowStatus } = require('./utils')

const { expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let voting
  let userInList
  let userNotInList

  before(async () => {
    const accounts = await ethers.getSigners()
    userInList = accounts[1]
    userNotInList = accounts[2]
  })

  describe('onlyVoters modifier', () => {
    beforeEach(async () => {
      await deployments.fixture(['voting'])
      voting = await ethers.getContract('Voting')
      await voting.addVoter(userInList.address)
    })
    it("Can't getVoter if not a voter", async () => {
      const res = await voting.connect(userInList).getVoter(userInList.address)

      await expect(
        voting.connect(userNotInList).getVoter(userInList.address)
      ).to.be.revertedWith("You're not a voter")
    })

    it("Can't addProposal if not a voter", async () => {
      await setWorkflowStatus(
        voting,
        WorkflowStatus.ProposalsRegistrationStarted
      )
      await expect(
        voting.connect(userNotInList).addProposal(proposals[1].description)
      ).to.be.revertedWith("You're not a voter")
    })

    it("Can't getOneProposal if not a voter", async () => {
      await setWorkflowStatus(
        voting,
        WorkflowStatus.ProposalsRegistrationStarted
      )

      await voting.connect(userInList).addProposal(proposals[1].description)

      await expect(
        voting.connect(userNotInList).getOneProposal(1)
      ).to.be.revertedWith("You're not a voter")
    })

    it("Can't setVote if not a voter", async () => {
      await voting.startProposalsRegistering()

      await voting.connect(userInList).addProposal(proposals[1].description)

      await voting.endProposalsRegistering()
      await voting.startVotingSession()

      await expect(voting.connect(userNotInList).setVote(1)).to.be.revertedWith(
        "You're not a voter"
      )
    })
  })

  describe('onlyOwner modifier', () => {
    beforeEach(async () => {
      await deployments.fixture(['voting'])
      voting = await ethers.getContract('Voting')
    })

    const revertMessage = 'Ownable: caller is not the owner'

    it("Can't addVoter if not the owner", async () => {
      await expect(
        voting.connect(userInList).addVoter(userInList.address)
      ).to.be.revertedWith(revertMessage)
    })
    it("Can't startProposalsRegistering if not the owner", async () => {
      await expect(
        voting.connect(userInList).startProposalsRegistering()
      ).to.be.revertedWith(revertMessage)
    })
    it("Can't endProposalsRegistering if not the owner", async () => {
      await setWorkflowStatus(
        voting,
        WorkflowStatus.ProposalsRegistrationStarted
      )
      await expect(
        voting.connect(userInList).endProposalsRegistering()
      ).to.be.revertedWith(revertMessage)
    })
    it("Can't startVotingSession if not the owner", async () => {
      await setWorkflowStatus(voting, WorkflowStatus.ProposalsRegistrationEnded)
      await expect(
        voting.connect(userInList).startVotingSession()
      ).to.be.revertedWith(revertMessage)
    })
    it("Can't endVotingSession if not the owner", async () => {
      await setWorkflowStatus(voting, WorkflowStatus.VotingSessionStarted)
      await expect(
        voting.connect(userInList).endVotingSession()
      ).to.be.revertedWith(revertMessage)
    })
    it("Can't tallyVotes if not the owner", async () => {
      await setWorkflowStatus(voting, WorkflowStatus.VotingSessionEnded)
      await expect(voting.connect(userInList).tallyVotes()).to.be.revertedWith(
        revertMessage
      )
    })
  })
}
