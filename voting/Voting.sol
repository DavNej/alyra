// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Voting {
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    struct Voter {
        bool hasVoted;
        bool isRegistered;
        uint256 votedProposalId;
    }

    struct Proposal {
        string description;
        uint256 voteCount;
    }
}
