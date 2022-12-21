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

    modifier animalExists(uint256 _id) {
        require(_id < animals.length, "Id not registered");
        require(animals[_id].size > 0, "Animal was deleted");
        _;
    }

    modifier checkAnimalProps(string memory _race, uint256 _size) {
        require(
            keccak256(abi.encodePacked(_race)) !=
                keccak256(abi.encodePacked("")),
            "Race must be specified"
        );
        require(_size > 0, "Size must be greater than 0");
        _;
    }

    //CRUD
    function addAnimal(
        uint256 _age,
        string memory _race,
        uint256 _size
    ) external checkAnimalProps(_race, _size) {
        Animal memory animal;

        animal.age = _age;
        animal.size = _size;
        animal.race = _race;

        animals.push(animal);

        emit animalAdded(animals.length - 1);
    }

    function getAnimal(uint256 _id)
        external
        view
        animalExists(_id)
        returns (Animal memory)
    {
        return animals[_id];
    }

    function updateAnimal(
        uint256 _id,
        uint256 _age,
        string memory _race,
        uint256 _size,
        bool _isAdopted
    ) external checkAnimalProps(_race, _size) {
        animals[_id].race = _race;
        animals[_id].size = _size;
        animals[_id].age = _age;
        animals[_id].isAdopted = _isAdopted;
    }

    function deleteAnimal(uint256 _id) external animalExists(_id) {
        delete animals[_id];
    }

    function adoptAnimal(uint256 _id) external animalExists(_id) {
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

    function adoptIf(
        uint256 _maxAge,
        string memory _race,
        uint256 _maxSize
    ) external returns (bool) {
        bool adopted;
        bytes32 raceHash = keccak256(abi.encodePacked(_race));

        for (uint256 i = 0; i < animals.length; i++) {
            if (animals[i].isAdopted) continue;
            if (animals[i].age >= _maxAge) continue;
            if (animals[i].size >= _maxSize) continue;
            if (keccak256(abi.encodePacked(animals[i].race)) == raceHash) {
                adopted = true;
                this.adoptAnimal(i);
                break;
            }
        }

        return adopted;
    }
}
