// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Bank {
    mapping(address => uint256) balances;

    function deposit() external payable {
        require(msg.value >= 100, "Minimum value to deposit is 100 wei");
        balances[msg.sender] += msg.value;
    }

    function withdraw() external {
        require(balances[msg.sender] > 0, "No funds to withdraw");
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = 0;
        (bool sent, ) = msg.sender.call{value: balance}("");
        require(sent, "Withdrawal failed");
    }
}
