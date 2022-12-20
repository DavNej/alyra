# Exercice

 
* Complétez le smart contract suivant qui permet de créer un Wallet en ligne.
* Faites tous les tests unitaires nécessaires de ce smart contract. 

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Bank {
    struct Account {
        uint256 balance;
        uint256 lastDeposit;
    }

    mapping(address => Account) private accounts;

    event etherDeposited(address indexed account, uint256 amount);
    event etherWithdrawed(address indexed account, uint256 amount);

    function getBalanceAndLastDeposit()
        external
        view
        returns (Account memory)
    {}

    function withdraw(uint256 _amount) external {}

    function deposit() external payable {}
}
```
