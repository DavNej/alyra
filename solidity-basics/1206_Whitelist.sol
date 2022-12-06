// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Whitelist {
    event Authorized(address _address);

    mapping(address => bool) whitelist;

    function authorize(address _address) external {
        whitelist[_address] = true;
        emit Authorized(_address);
    }
}
