// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

error Stageable__ActionForbiddenAtThisStage(uint256 _status);

/**
 * @title A voting stage contract
 * @author David Nejar
 */

abstract contract Stageable is Ownable {
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus private workflowStatus;

    /**
     * @dev Throws if is not in the right stage.
     * @param _status the status to allow
     */
    modifier onlyInStatus(WorkflowStatus _status) {
        if (workflowStatus != _status) {
            revert Stageable__ActionForbiddenAtThisStage(uint256(_status));
        }
        _;
    }

    constructor() {
        /// @dev Set default stage to RegisteringVoters
        workflowStatus = WorkflowStatus.RegisteringVoters;
    }

    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );

    /// @dev We assume that the owner of the contract will be able to pass freely from one stage to another regardless of the order

    /**
     * @dev Set the workflow stage to RegisteringVoters.
     * Can only be called by the current owner.
     */
    function setRegisteringVoters() internal onlyOwner {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.RegisteringVoters;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    /**
     * @dev Set the workflow stage to ProposalsRegistrationStarted.
     * Can only be called by the current owner.
     */
    function setProposalsRegistrationStarted() internal onlyOwner {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    /**
     * @dev Set the workflow stage to ProposalsRegistrationEnded.
     * Can only be called by the current owner.
     */
    function setProposalsRegistrationEnded() internal onlyOwner {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    /**
     * @dev Set the workflow stage to VotingSessionStarted.
     * Can only be called by the current owner.
     */
    function setVotingSessionStarted() internal onlyOwner {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    /**
     * @dev Set the workflow stage to VotingSessionEnded.
     * Can only be called by the current owner.
     */
    function setVotingSessionEnded() internal onlyOwner {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }

    /**
     * @dev Set the workflow stage to VotesTallied.
     * Can only be called by the current owner.
     */
    function setVotesTallied() internal onlyOwner {
        WorkflowStatus previousStatus = workflowStatus;
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(previousStatus, workflowStatus);
    }
}
