// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

error Whitelist__NotAuthorized();

contract Whitelist {
    event Authorized(address _address);
    mapping(address => bool) whitelist;

    constructor() {
        whitelist[msg.sender] = true;
    }

    modifier senderIsInWhitelist() {
        // require(whitelist[msg.sender], "You are not authorized");
        // OR
        if (!whitelist[msg.sender]) {
            revert Whitelist__NotAuthorized();
        }
        _;
    }

    function authorize(address _address) external senderIsInWhitelist {
        whitelist[_address] = true;
        emit Authorized(_address);
    }
}
