// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract SelfDestruct {
    address immutable i_owner;
    uint256 number;

    constructor() {
        i_owner = msg.sender;
    }

    function setNumber(uint256 _number) public {
        number = _number;
    }

    function destroySmartContract(address payable _to) public {
        require(i_owner == msg.sender, "Not the owner");
        selfdestruct(_to); // with _to address to send ETH owned by contract. Only ETH will be sent
    }

    receive() external payable {} // allow contract to reveive. no implementation needed
}
