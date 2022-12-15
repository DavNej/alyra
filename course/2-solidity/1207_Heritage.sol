// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./1207_Ownable.sol";
import "./1207_Pausable.sol";

contract Heritage is Ownable, Pausable {
    uint256 number;

    function setNumber(uint256 _number) public onlyOwner notPaused {
        number = _number;
    }
}
