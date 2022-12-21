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

    Animal[] private animals;
    mapping(address => uint256) public adoptions;

    event animalAdded(uint256 indexed id);
    event animalAdopted(uint256 indexed _id, address indexed _addr);

    modifier idInArray(uint256 _id) {
        require(_id < animals.length, "Id not registered");
        _;
    }

    modifier animalExists(uint256 _id) {
        require(animals[_id].age > 0, "Animal was deleted");
        require(animals[_id].size > 0, "Animal was deleted");
        _;
    }

    //CRUD
    function add(
        string memory _race,
        uint256 _size,
        uint256 _age
    ) external {
        Animal memory animal;

        require(_age > 0, "Age must be greater than 0");
        require(_size > 0, "Size must be greater than 0");

        animal.age = _age;
        animal.size = _size;
        animal.race = _race;

        animals.push(animal);

        emit animalAdded(animals.length - 1);
    }

    function get(uint256 _id)
        external
        view
        idInArray(_id)
        returns (Animal memory)
    {
        return animals[_id];
    }

    function set(
        uint256 _id,
        string memory _race,
        uint256 _size,
        uint256 _age
    ) external {
        Animal memory animal = this.get(_id);

        animal.race = _race;
        animal.size = _size;
        animal.age = _age;

        animals[_id] = animal;
    }

    function remove(uint256 _id) external idInArray(_id) animalExists(_id) {
        delete animals[_id];
    }

    function adopt(uint256 _id) external idInArray(_id) animalExists(_id) {
        if (animals[_id].isAdopted) {
            revert Spa__AlreadyAdopted();
        }
        animals[_id].isAdopted = true;
        adoptions[msg.sender] = _id;

        emit animalAdopted(_id, msg.sender);
    }

    function getAdoption(address _addr) external view returns (Animal memory) {
        return animals[adoptions[_addr]];
    }

    function adoptIfMax(
        string memory _race,
        uint256 _maxSize,
        uint256 _maxAge
    ) external returns (bool) {
        bool adopted;

        for (uint256 i = 0; i < animals.length; i++) {
            if (animals[i].isAdopted) continue;
            if (animals[i].age >= _maxAge) continue;
            if (animals[i].size >= _maxSize) continue;
            if (
                keccak256(abi.encodePacked(animals[i].race)) ==
                keccak256(abi.encodePacked(_race))
            ) {
                adopted = true;
                this.adopt(i);
                break;
            }
        }

        return adopted;
    }
}
