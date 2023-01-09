const WorkflowStatus = {
  RegisteringVoters: 0,
  ProposalsRegistrationStarted: 1,
  ProposalsRegistrationEnded: 2,
  VotingSessionStarted: 3,
  VotingSessionEnded: 4,
  VotesTallied: 5,
}

const proposals = [
  { description: 'GENESIS', voteCount: 0 },
  { description: 'Peace on earth' },
  { description: 'Be happy' },
  { description: 'Educate ourselves' },
]

async function setWorkflowStatus(voting, status) {
  switch (status) {
    case WorkflowStatus.RegisteringVoters:
      // this is let empty because it is the default status and
      // there is no function to set status to 'RegisteringVoters' in smart contract 🤷
      break

    case WorkflowStatus.ProposalsRegistrationStarted:
      await voting.startProposalsRegistering()
      break

    case WorkflowStatus.ProposalsRegistrationEnded:
      await voting.startProposalsRegistering()
      await voting.endProposalsRegistering()
      break

    case WorkflowStatus.VotingSessionStarted:
      await voting.startProposalsRegistering()
      await voting.endProposalsRegistering()
      await voting.startVotingSession()
      break

    case WorkflowStatus.VotingSessionEnded:
      await voting.startProposalsRegistering()
      await voting.endProposalsRegistering()
      await voting.startVotingSession()
      await voting.endVotingSession()
      break

    // no function to set status to 'VotesTallied' in smart contract 🤷
  }
}

module.exports = {
  proposals,
  setWorkflowStatus,
  WorkflowStatus,
}
