// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract People {
    struct Person {
        string name;
        uint256 age;
    }

    Person[] public persons;

    function addPerson(string memory _name, uint256 _age) public {
        persons.push(Person(_name, _age));
    }

    function removeLastPerson() public {
        persons.pop();
    }
}
