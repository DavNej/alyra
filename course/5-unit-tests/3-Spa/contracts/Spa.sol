// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error Spa__AlreadyAdopted();

contract Spa {
    struct Animal {
        string race;
        uint256 size;
        uint256 age;
        bool isAdopted;
    }

    Animal[] animals;
    mapping(address => uint256) public adoption;

    event animalAdded(uint256 indexed id);
    event animalAdopted(uint256 indexed _id, address indexed _addr);

    //CRUD
    function add(
        string memory _race,
        uint256 _size,
        uint256 _age
    ) external {}

    function get(uint256 _id) external view returns (Animal memory) {}

    function set(
        uint256 _id,
        string memory _race,
        uint256 _size,
        uint256 _age
    ) external {}

    function remove(uint256 _id) external {}

    function adopt(uint256 _id) external {}

    function getAdoption(address _addr) external view returns (Animal memory) {}

    function adoptIfMax(
        string memory _race,
        uint256 _maxSize,
        uint256 _maxAge
    ) external returns (bool) {}
}
