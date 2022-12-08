// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Admin is Ownable {
    mapping(address => bool) whitelist;
    mapping(address => bool) blacklist;

    event Whitelisted(address indexed _address);
    event Blacklisted(address indexed _address);

    function addToWhitelist(address _address) external onlyOwner {
        whitelist[_address] = true;
        emit Whitelisted(_address);
    }

    function isWhitelisted(address _address) external view returns (bool) {
        return whitelist[_address];
    }

    function addToBlacklist(address _address) external onlyOwner {
        require(!blacklist[_address], "already blacklisted");
        require(!whitelist[_address], "already whitelisted");
        blacklist[_address] = true;
        emit Blacklisted(_address);
    }

    function isBlacklisted(address _address) external view returns (bool) {
        return blacklist[_address];
    }
}
