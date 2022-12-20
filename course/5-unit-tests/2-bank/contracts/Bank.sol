// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Bank {
    struct Account {
        uint256 balance;
        uint256 lastDeposit;
    }

    mapping(address => Account) private accounts;

    event etherDeposited(address indexed account, uint256 amount);
    event etherWithdrawn(address indexed account, uint256 amount);

    function getBalanceAndLastDeposit() external view returns (Account memory) {
        return accounts[msg.sender];
    }

    function deposit() external payable {
        require(msg.value >= 100, "Minimum deposit is 100 wei");

        accounts[msg.sender].lastDeposit = block.timestamp;
        accounts[msg.sender].balance += msg.value;

        emit etherDeposited(msg.sender, msg.value);
    }

    function withdraw(uint256 _amount) external {
        require(_amount >= 100, "Minimum amount to withdraw is 100 wei");
        require(accounts[msg.sender].balance >= _amount, "Unsufficient funds");

        accounts[msg.sender].balance -= _amount;
        (bool sent, ) = msg.sender.call{value: _amount}("");

        require(sent, "Could not proceed transaction");
        emit etherWithdrawn(msg.sender, _amount);
    }
}
