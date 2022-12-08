// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// This contract transfert fund form address to address run few checks on the way. It acts as a intermediary
contract BalanceTransfer {
    address myAddress;

    function setMyAddress(address _address) public {
        require(_address != address(0), "Can't send to 0");
        myAddress = _address;
    }

    function getBalance() public view returns (uint256) {
        return myAddress.balance;
    }

    function getBalanceOf(address _address) public view returns (uint256) {
        return _address.balance;
    }

    function transferEthTo(address payable _to) public payable {
        require(_to != address(0), "Can't send to 0");
        (bool sent, ) = _to.call{value: msg.value}("");
        require(sent, "Transfer failed");
    }

    function transferToMyAddress(uint256 _threshold) public payable {
        require(msg.value >= 1, "Not amount too low");
        require(this.getBalance() >= _threshold, "Not enough funds");
        (bool sent, ) = myAddress.call{value: msg.value}("");
        require(sent, "Transfer failed");
    }
}
