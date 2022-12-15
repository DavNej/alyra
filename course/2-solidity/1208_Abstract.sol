// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

// an abstract contract cannot be deployed by itself. It must be heritated

abstract contract Age {
    uint256 internal age;

    constructor(uint256 _age) {
        age = _age;
    }

    function getAge() public view virtual returns (uint256) {
        return age;
    }

    function setAge(uint256 _age) public virtual {
        age = _age;
    }
}

contract Hello is Age {
    string public name;

    constructor(string memory _name, uint256 _age) Age(_age) {
        name = _name;
    }

    function getName() public view virtual returns (string memory) {
        return name;
    }

    function setName(string memory _name) public virtual {
        name = _name;
    }

    function getAge() public pure virtual override returns (uint256) {
        return 55;
    }

    function setAge(uint256 _age) public virtual override {
        age = 2 * _age;
    }
}
