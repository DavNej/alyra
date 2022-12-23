const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { setWorkflowStatus } = require('./utils')

const { expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let voting
  let _user1

  const proposal1 = 'Peace on earth'

  before(async () => {
    const accounts = await ethers.getSigners()
    _user1 = accounts[1]
  })

  beforeEach(async () => {
    await deployments.fixture(['voting'])
    voting = await ethers.getContract('Voting')
  })

  describe('Revert if NOT called on the right WorkflowStatus', () => {
    describe('Function changing WorkflowStatus', () => {
      describe('startProposalsRegistering only in status "RegisteringVoters"', () => {
        afterEach(async () => {
          await expect(voting.startProposalsRegistering()).to.be.revertedWith(
            'Registering proposals cant be started now'
          )
        })

        it("'ProposalsRegistrationStarted' status", async () => {
          await setWorkflowStatus(voting, 'ProposalsRegistrationStarted')
        })
        it("'ProposalsRegistrationEnded' status", async () => {
          await setWorkflowStatus(voting, 'ProposalsRegistrationEnded')
        })
        it("'VotingSessionStarted' status", async () => {
          await setWorkflowStatus(voting, 'VotingSessionStarted')
        })
        it("'VotingSessionEnded' status", async () => {
          await setWorkflowStatus(voting, 'VotingSessionEnded')
        })
      })

      describe('endProposalsRegistering only in status "ProposalsRegistrationStarted"', () => {
        afterEach(async () => {
          await expect(voting.endProposalsRegistering()).to.be.revertedWith(
            'Registering proposals havent started yet'
          )
        })

        it("'RegisteringVoters' status", async () => {
          await setWorkflowStatus(voting, 'RegisteringVoters')
        })
        it("'ProposalsRegistrationEnded' status", async () => {
          await setWorkflowStatus(voting, 'ProposalsRegistrationEnded')
        })
        it("'VotingSessionStarted' status", async () => {
          await setWorkflowStatus(voting, 'VotingSessionStarted')
        })
        it("'VotingSessionEnded' status", async () => {
          await setWorkflowStatus(voting, 'VotingSessionEnded')
        })
      })

      describe('startVotingSession only in status "ProposalsRegistrationEnded"', () => {
        afterEach(async () => {
          await expect(voting.startVotingSession()).to.be.revertedWith(
            'Registering proposals phase is not finished'
          )
        })

        it("'RegisteringVoters' status", async () => {
          await setWorkflowStatus(voting, 'RegisteringVoters')
        })
        it("'ProposalsRegistrationStarted' status", async () => {
          await setWorkflowStatus(voting, 'ProposalsRegistrationStarted')
        })
        it("'VotingSessionStarted' status", async () => {
          await setWorkflowStatus(voting, 'VotingSessionStarted')
        })
        it("'VotingSessionEnded' status", async () => {
          await setWorkflowStatus(voting, 'VotingSessionEnded')
        })
      })

      describe('endVotingSession only in status "VotingSessionStarted"', () => {
        afterEach(async () => {
          await expect(voting.endVotingSession()).to.be.revertedWith(
            'Voting session havent started yet'
          )
        })

        it("'RegisteringVoters' status", async () => {
          await setWorkflowStatus(voting, 'RegisteringVoters')
        })
        it("'ProposalsRegistrationStarted' status", async () => {
          await setWorkflowStatus(voting, 'ProposalsRegistrationStarted')
        })
        it("'ProposalsRegistrationEnded' status", async () => {
          await setWorkflowStatus(voting, 'ProposalsRegistrationEnded')
        })
        it("'VotingSessionEnded' status", async () => {
          await setWorkflowStatus(voting, 'VotingSessionEnded')
        })

        // no function to set status to 'VotesTallied' 🤷
      })
    })

    describe('addVoter only in status "RegisteringVoters"', () => {
      afterEach(async () => {
        await expect(voting.addVoter(_user1.address)).to.be.revertedWith(
          'Voters registration is not open yet'
        )
      })

      it("'ProposalsRegistrationStarted' status", async () => {
        await setWorkflowStatus(voting, 'ProposalsRegistrationStarted')
      })
      it("'ProposalsRegistrationEnded' status", async () => {
        await setWorkflowStatus(voting, 'ProposalsRegistrationEnded')
      })
      it("'VotingSessionStarted' status", async () => {
        await setWorkflowStatus(voting, 'VotingSessionStarted')
      })
      it("'VotingSessionEnded' status", async () => {
        await setWorkflowStatus(voting, 'VotingSessionEnded')
      })
    })

    describe("addProposal only in status 'ProposalsRegistrationStarted'", () => {
      beforeEach(async () => {
        await voting.addVoter(_user1.address)
      })

      afterEach(async () => {
        await expect(
          voting.connect(_user1).addProposal(proposal1)
        ).to.be.revertedWith('Proposals are not allowed yet')
      })

      it("'RegisteringVoters' status", async () => {
        await setWorkflowStatus(voting, 'RegisteringVoters')
      })
      it("'ProposalsRegistrationEnded' status", async () => {
        await setWorkflowStatus(voting, 'ProposalsRegistrationEnded')
      })
      it("'VotingSessionStarted' status", async () => {
        await setWorkflowStatus(voting, 'VotingSessionStarted')
      })
      it("'VotingSessionEnded' status", async () => {
        await setWorkflowStatus(voting, 'VotingSessionEnded')
      })
    })
  })
}
