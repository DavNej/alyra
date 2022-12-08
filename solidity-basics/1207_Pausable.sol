// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

error Pausable__IsPaused();

contract Pausable {
    bool public paused; // common practice to pause the contract if something goes wrong
    modifier notPaused() {
        if (!paused) {
            revert Pausable__IsPaused();
        }
        _;
    }

    function setPaused(bool _paused) public {
        paused = _paused;
    }
}
