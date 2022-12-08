// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Random {
    uint256 nonce;

    function random() external returns (uint256) {
        nonce++;
        return
            uint256(keccak256(abi.encodePacked(nonce, block.timestamp))) % 100;
    }
}
