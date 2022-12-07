// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

error Owner__IsNotOwner();
error Owner__IsPaused();

contract Owner {
    address immutable i_owner; // immutable can be changed only in constructor
    bool public paused; // common practice to pause the contract if something goes wrong
    uint256 public number;

    constructor() {
        i_owner = msg.sender;
    }

    function setPaused(bool _paused) public {
        if (msg.sender != i_owner) {
            revert Owner__IsNotOwner();
        }
        paused = _paused;
    }

    function setNumber(uint256 _number) public {
        if (msg.sender != i_owner) {
            revert Owner__IsNotOwner();
        }
        if (!paused) {
            revert Owner__IsPaused();
        }
        number = _number;
    }
}
