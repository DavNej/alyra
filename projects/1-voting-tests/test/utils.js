async function setWorkflowStatus(voting, status) {
  switch (status) {
    case 'RegisteringVoters':
      // this is let empty because it is the default status
      break

    case 'ProposalsRegistrationStarted':
      await voting.startProposalsRegistering()
      break

    case 'ProposalsRegistrationEnded':
      await voting.startProposalsRegistering()
      await voting.endProposalsRegistering()
      break

    case 'VotingSessionStarted':
      await voting.startProposalsRegistering()
      await voting.endProposalsRegistering()
      await voting.startVotingSession()
      break

    case 'VotingSessionEnded':
      await voting.startProposalsRegistering()
      await voting.endProposalsRegistering()
      await voting.startVotingSession()
      await voting.endVotingSession()
      break

    // no function to set status to 'VotesTallied' 🤷
  }
}

module.exports = {
  setWorkflowStatus,
}
