// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Wallet online
contract PiggyBank {
    struct Wallet {
        uint256 balance;
        uint256 numPayments;
    }

    mapping(address => Wallet) wallets;

    receive() external payable {
        wallets[msg.sender].balance += msg.value;
        wallets[msg.sender].numPayments++;
    }

    function getTotalBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getBalance() public view returns (uint256) {
        return wallets[msg.sender].balance;
    }

    function withdraw(address payable _to) public {
        uint256 _balance = wallets[msg.sender].balance;
        wallets[msg.sender].balance = 0;
        (bool sent, ) = _to.call{value: _balance}("");
        require(sent, "Failed to send Ether");
    }
}
