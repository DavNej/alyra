// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Products {
    enum Step {
        Purschased,
        Sent,
        Delivered
    }
    struct Product {
        uint256 SKU;
        Step step;
    }

    mapping(address => Product) public commands;

    function purchase(uint256 _SKU) public {
        Product memory p = Product(_SKU, Step.Purschased);
        commands[msg.sender] = p;
    }

    function send() public {
        commands[msg.sender].step = Step.Sent;
    }
}
