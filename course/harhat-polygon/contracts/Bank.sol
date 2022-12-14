// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Bank {
    mapping(address => uint256) balances;

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        (bool sent, ) = msg.sender.call{value: balances[msg.sender]}("");
        require(sent, "Withdrawal failed");
    }
}
