// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

error Ownable__IsNotOwner();

contract Ownable {
    address immutable i_owner; // immutable can be changed only in constructor

    constructor() {
        i_owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != i_owner) {
            revert Ownable__IsNotOwner();
        }
        _;
    }
}
