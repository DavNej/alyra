const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { proposals, setWorkflowStatus, WorkflowStatus } = require('./utils')

const { expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let voting
  let owner
  let userInList
  let userNotInList

  before(async () => {
    const accounts = await ethers.getSigners()
    owner = accounts[0]
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

}
