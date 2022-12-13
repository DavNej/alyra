// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "./Stageable.sol";

error Voting__NotInWhitelist(address _address);
error Voting__NotInWhitelistOrOwner(address _address);
error Voting__AlreadyVoted(address _address);
error Voting__AlreadyRegistered(address _address);

/** Some values to run tests

Voters

0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB

Proposals

Peace on earth
Equality between sex
Ban weapons
Be happy together

*/

/**
 * @title Voting
 * @dev Voting contract for small organizations
 */
contract Voting is Ownable, Stageable {
    struct Voter {
        bool hasVoted;
        bool isRegistered;
        uint256 votedProposalId;
    }

    mapping(address => Voter) whitelist;

    struct Proposal {
        string description;
        uint256 voteCount;
    }

    Proposal[] proposals;

    uint256 winningProposalId;

    /**
     * @dev Throws if voter is not in whitelist.
     * Owner is not in whitelist.
     */
    modifier onlyWhitelist() {
        if (msg.sender == owner() || !whitelist[msg.sender].isRegistered) {
            revert Voting__NotInWhitelist(msg.sender);
        }
        _;
    }

    /**
     * @dev Throws if is not the owner or if voter is not in whitelist.
     */
    modifier onlyOwnerOrWhitelist() {
        if (msg.sender != owner() && !whitelist[msg.sender].isRegistered) {
            revert Voting__NotInWhitelistOrOwner(msg.sender);
        }
        _;
    }

    /**
     * @dev Throws if index of proposal is out of range.
     * @param _id id of the proposal
     */
    modifier onlyExistingProposal(uint256 _id) {
        require(_id < proposals.length, "Proposal id out of range");
        _;
    }

    constructor() {
        // Proposals are initialized with a genesisProposal
        // so when a voter has not voted, their votedProposalId will point to it by default.
        Proposal memory genesisProposal;
        genesisProposal
            .description = "Genesis proposal. Acts as default. Can't be voted for";
        proposals.push(genesisProposal);
    }

    event VoterRegistered(address voterAddress);
    event ProposalRegistered(uint256 proposalId);
    event Voted(address voter, uint256 proposalId);

    /**
     * @dev Add a new voter to the whitelist
     * @param _address address of the voter to be registered
     * Can only be called by the current owner.
     * Can only be called during the {RegisteringVoters} stage.
     * Emits a {VoterRegistered} event indicating the voter address.
     */
    function addVoter(address _address)
        external
        onlyInStatus(WorkflowStatus.RegisteringVoters)
        onlyOwner
    {
        if (whitelist[_address].isRegistered) {
            revert Voting__AlreadyRegistered(_address);
        }
        whitelist[_address].isRegistered = true;
        emit VoterRegistered(_address);
    }

    /**
     * @dev See a given voter
     * @param _address address of the voter to retrieve
     * @return Voter
     * Can only be called by the current owner or another voter.
     * Can be called whatever the stage.
     */
    function getVoter(address _address)
        external
        view
        onlyOwnerOrWhitelist
        returns (Voter memory)
    {
        return whitelist[_address];
    }

    /**
     * @dev Add a new proposal
     * @param _description description of the proposal to add
     * The case in which a proposal already exists is not treated.
     * Can only be called by the current owner or another voter.
     * Can only be called during the {ProposalsRegistrationStarted} stage.
     * Emits a {ProposalRegistered} event indicating the proposal id.
     */
    function addProposal(string memory _description)
        external
        onlyInStatus(WorkflowStatus.ProposalsRegistrationStarted)
        onlyOwnerOrWhitelist
    {
        Proposal memory proposal;
        proposal.description = _description;

        proposals.push(proposal);

        emit ProposalRegistered(proposals.length - 1);
    }

    /**
     * @dev See a given proposal
     * @param _description description of the proposal to add
     * @return description of the proposal
     * Can only be called by the current owner or another voter.
     */
    function getProposal(uint256 _proposalId)
        external
        view
        onlyExistingProposal(_proposalId)
        onlyOwnerOrWhitelist
        returns (Proposal memory)
    {
        return proposals[_proposalId];
    }

    /**
     * @dev Vote for a proposal
     * @param _proposalId id of the proposal to vote for
     * Owner is not allowed to vote
     * Can only be called by voters on the whitelist that have not voted.
     * Can only be called during the {VotingSessionStarted} stage.
     * Emits a {Voted} event indicating the voter address and the proposal id.
     */
    function vote(uint256 _proposalId)
        external
        onlyInStatus(WorkflowStatus.VotingSessionStarted)
        onlyWhitelist
        onlyExistingProposal(_proposalId)
    {
        require(_proposalId > 0, "Can't vote for Genesis proposal");

        if (whitelist[msg.sender].hasVoted) {
            revert Voting__AlreadyVoted(msg.sender);
        }

        whitelist[msg.sender].hasVoted = true;
        whitelist[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount += 1;

        emit Voted(msg.sender, _proposalId);
    }

    /**
     * @dev Compute votes and declare the winning proposal.
     * Can only be called by the owner.
     * Can only be called during the {VotingSessionEnded} stage.
     */
    function computeWinner()
        external
        onlyInStatus(WorkflowStatus.VotingSessionEnded)
        onlyOwner
    {
        uint256 maxVoteCount;
        uint256 winnerId;
        for (uint256 i = 1; i < proposals.length; i++) {
            if (proposals[i].voteCount > maxVoteCount) {
                maxVoteCount = proposals[i].voteCount;
                winnerId = i;
            }
        }
        winningProposalId = winnerId;
    }

    /**
     * @dev See the descrition of the winning proposal.
     * @return description of the winning proposal
     * Can be called by anyone.
     * Can only be called during the {VotesTallied} stage.
     */
    function getWinner()
        public
        view
        onlyInStatus(WorkflowStatus.VotesTallied)
        returns (string memory)
    {
        require(winningProposalId != 0, "No winner has been declared yet");
        return proposals[winningProposalId].description;
    }
}
