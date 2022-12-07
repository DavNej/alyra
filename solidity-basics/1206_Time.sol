// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Time {
    function getTime() external view returns (uint256) {
        return block.timestamp;
    }
}
