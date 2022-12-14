// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "./1207_Ownable.sol";

contract Savings is Ownable {
    uint256 firstTxTimestamp;

    modifier canWithdraw() {
        require(
            block.timestamp > (firstTxTimestamp + 1 minutes),
            "Holding period not over"
        );
        _;
    }

    receive() external payable {
        if (firstTxTimestamp == 0) {
            firstTxTimestamp = block.timestamp;
        }
    }

    function withdraw() external onlyOwner canWithdraw {
        (bool sent, ) = i_owner.call{value: address(this).balance}("");
        require(sent, "Funds could not be sent");
    }
}
