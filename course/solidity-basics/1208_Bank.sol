// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Bank {
    mapping(address => uint256) balances;

    function deposit(uint256 _amount) external {
        balances[msg.sender] += _amount;
    }

    function transefert(address _to, uint256 _amount) external {
        require(_to != address(0), "can't send to address 0");
        require(_amount > balances[msg.sender], "unsufficent balance");

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function balanceOf(address _address) external view returns (uint256) {
        return balances[_address];
    }
}
