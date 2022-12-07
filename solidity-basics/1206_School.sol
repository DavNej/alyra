// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract School {
    struct Student {
        string name;
        uint8[] grades;
    }

    mapping(address => Student) public students;

    function addName(address _student, string memory _name) public {
        students[_student].name = _name;
    }

    function addGrade(address _student, uint8 _grade) public {
        students[_student].grades.push(_grade);
    }

    function getGrades(address _student) public view returns (uint8[] memory) {
        return students[_student].grades;
    }

    function getAverage(address _student) public view returns (uint256) {
        uint256 sum = 0;
        uint8[] memory grades = students[_student].grades;
        uint256 numberOfGrades = grades.length;

        for (uint256 i = 0; i < numberOfGrades; i++) {
            sum += grades[i];
        }

        return sum / numberOfGrades; // no decimal figures in solidity ?
    }
}
