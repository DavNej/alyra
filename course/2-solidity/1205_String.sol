// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// string uses more gas than bytes
// use string if > 32 bytes

// Simple contract to set ansd get a string
contract String {
    string value;

    function setString(string memory _value) external {
        value = _value;
    }

    function getString() external view returns (string memory) {
        return value;
    }
}
