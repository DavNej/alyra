const { network, deployments, ethers } = require('hardhat')
const { developmentChains } = require('../helper-hardhat-config')
const { setWorkflowStatus, WorkflowStatus, proposals } = require('./utils')

const { expect } = require('chai')

if (developmentChains.includes(network.name)) {
  let voting
  let user1

  before(async () => {
    const accounts = await ethers.getSigners()
    user1 = accounts[1]
  })

  describe('Revert if NOT called on the right WorkflowStatus', () => {
    beforeEach(async () => {
      await deployments.fixture(['voting'])
      voting = await ethers.getContract('Voting')
    })
    describe('Function changing WorkflowStatus', () => {
      describe('startProposalsRegistering only in status "RegisteringVoters"', () => {
        afterEach(async () => {
          await expect(voting.startProposalsRegistering()).to.be.revertedWith(
            'Registering proposals cant be started now'
          )
        })

        it("'ProposalsRegistrationStarted' status", async () => {
          await setWorkflowStatus(
            voting,
            WorkflowStatus.ProposalsRegistrationStarted
          )
        })
        it("'ProposalsRegistrationEnded' status", async () => {
          await setWorkflowStatus(
            voting,
            WorkflowStatus.ProposalsRegistrationEnded
          )
        })
        it("'VotingSessionStarted' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.VotingSessionStarted)
        })
        it("'VotingSessionEnded' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.VotingSessionEnded)
        })
      })

      describe('endProposalsRegistering only in status "ProposalsRegistrationStarted"', () => {
        afterEach(async () => {
          await expect(voting.endProposalsRegistering()).to.be.revertedWith(
            'Registering proposals havent started yet'
          )
        })

        it("'RegisteringVoters' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.RegisteringVoters)
        })
        it("'ProposalsRegistrationEnded' status", async () => {
          await setWorkflowStatus(
            voting,
            WorkflowStatus.ProposalsRegistrationEnded
          )
        })
        it("'VotingSessionStarted' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.VotingSessionStarted)
        })
        it("'VotingSessionEnded' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.VotingSessionEnded)
        })
      })

      describe('startVotingSession only in status "ProposalsRegistrationEnded"', () => {
        afterEach(async () => {
          await expect(voting.startVotingSession()).to.be.revertedWith(
            'Registering proposals phase is not finished'
          )
        })

        it("'RegisteringVoters' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.RegisteringVoters)
        })
        it("'ProposalsRegistrationStarted' status", async () => {
          await setWorkflowStatus(
            voting,
            WorkflowStatus.ProposalsRegistrationStarted
          )
        })
        it("'VotingSessionStarted' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.VotingSessionStarted)
        })
        it("'VotingSessionEnded' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.VotingSessionEnded)
        })
      })

      describe('endVotingSession only in status "VotingSessionStarted"', () => {
        afterEach(async () => {
          await expect(voting.endVotingSession()).to.be.revertedWith(
            'Voting session havent started yet'
          )
        })

        it("'RegisteringVoters' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.RegisteringVoters)
        })
        it("'ProposalsRegistrationStarted' status", async () => {
          await setWorkflowStatus(
            voting,
            WorkflowStatus.ProposalsRegistrationStarted
          )
        })
        it("'ProposalsRegistrationEnded' status", async () => {
          await setWorkflowStatus(
            voting,
            WorkflowStatus.ProposalsRegistrationEnded
          )
        })
        it("'VotingSessionEnded' status", async () => {
          await setWorkflowStatus(voting, WorkflowStatus.VotingSessionEnded)
        })

        // no function to set status to 'VotesTallied' 🤷
      })
    })

    describe('addVoter only in status "RegisteringVoters"', () => {
      afterEach(async () => {
        await expect(voting.addVoter(user1.address)).to.be.revertedWith(
          'Voters registration is not open yet'
        )
      })

      it("'ProposalsRegistrationStarted' status", async () => {
        await setWorkflowStatus(
          voting,
          WorkflowStatus.ProposalsRegistrationStarted
        )
      })
      it("'ProposalsRegistrationEnded' status", async () => {
        await setWorkflowStatus(
          voting,
          WorkflowStatus.ProposalsRegistrationEnded
        )
      })
      it("'VotingSessionStarted' status", async () => {
        await setWorkflowStatus(voting, WorkflowStatus.VotingSessionStarted)
      })
      it("'VotingSessionEnded' status", async () => {
        await setWorkflowStatus(voting, WorkflowStatus.VotingSessionEnded)
      })
    })

    describe("addProposal only in status 'ProposalsRegistrationStarted'", () => {
      beforeEach(async () => {
        await voting.addVoter(user1.address)
      })

      afterEach(async () => {
        await expect(
          voting.connect(user1).addProposal(proposals[1].description)
        ).to.be.revertedWith('Proposals are not allowed yet')
      })

      it("'RegisteringVoters' status", async () => {
        await setWorkflowStatus(voting, WorkflowStatus.RegisteringVoters)
      })
      it("'ProposalsRegistrationEnded' status", async () => {
        await setWorkflowStatus(
          voting,
          WorkflowStatus.ProposalsRegistrationEnded
        )
      })
      it("'VotingSessionStarted' status", async () => {
        await setWorkflowStatus(voting, WorkflowStatus.VotingSessionStarted)
      })
      it("'VotingSessionEnded' status", async () => {
        await setWorkflowStatus(voting, WorkflowStatus.VotingSessionEnded)
      })
    })

    describe('setVote only in status "VotingSessionStarted"', () => {
      beforeEach(async () => {
        await voting.addVoter(user1.address)
      })
      afterEach(async () => {
        await expect(voting.connect(user1).setVote(1)).to.be.revertedWith(
          'Voting session havent started yet'
        )
      })

      it("'RegisteringVoters' status", async () => {
        await setWorkflowStatus(voting, WorkflowStatus.RegisteringVoters)
      })
      it("'ProposalsRegistrationStarted' status", async () => {
        await setWorkflowStatus(voting, WorkflowStatus.RegisteringVoters)
      })
      it("'ProposalsRegistrationEnded' status", async () => {
        await setWorkflowStatus(
          voting,
          WorkflowStatus.ProposalsRegistrationEnded
        )
      })
      it("'VotingSessionEnded' status", async () => {
        await setWorkflowStatus(voting, WorkflowStatus.VotingSessionEnded)
      })
    })
  })
}
