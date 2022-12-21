# Exercice 

## Objectif

Réaliser un outil de gestion de nos animaux qui sont (malheureusement) à la SPA :(

## Specs

* Créer une structure `Animal` comprenant une race (string), une taille (uint/cm), un age (uint) et un booléen `isAdopted`
* Vous allez stocker l'ensemble de ces animaux dans un array
* lorsqu'ils sont adoptés, leur appartenance à un maitre (défini par son adresse) dans un mapping
* On utilisera l'ensemble comme une base de données relationnelle, pas de doublons!
* On réalisera un CRUD pour la gestion des animaux dans le tableau
* Un passionné pourra adopter un animal en fonction des critères qu'il veut, en terme de race, taille et d'âge. Et donc agir sur le mapping. `AdoptIfMax(string calldata _race, uint _tailleMax, uint _ageMax)`

* Le but est de tester votre application !

```solidity
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
```
