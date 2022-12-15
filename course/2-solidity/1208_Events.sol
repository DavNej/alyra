// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

// An event writes a log in the blockchain
// Some libs exist to query those logs

contract Events {
    uint256[] numbers;

    // to be declared below variables
    event numberAdded(address indexed _by, uint256 _number); // when address add "indexed" keyword

    function addNumber(uint256 _number) external {
        numbers.push(_number);
        emit numberAdded(msg.sender, _number);
    }
}
