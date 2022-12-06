// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Simple contract to understand mappings
contract Mapping {
    mapping(address => bool) whitelist;

    function addToWhitelist(address _user) external {
        whitelist[_user] = true;
    }

    function isInWhitelist(address _user) external view returns (bool) {
        return whitelist[_user];
    }

    function removeFromWhitelist(address _user) external {
        whitelist[_user] = false;
    }
}
