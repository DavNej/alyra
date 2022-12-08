// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Class is Ownable {
    struct Student {
        string name;
        uint256 gradeBiology;
        uint256 gradeMath;
        uint256 gradeEng;
    }

    mapping(address => bool) isTeacher;

    Student[] students;

    function addTeacher(address _teacherAddress) external onlyOwner {
        isTeacher[_teacherAddress] = true;
    }

    function addGrades(
        string memory _name,
        uint256 _gradeBiology,
        uint256 _gradeMath,
        uint256 _gradeEng
    ) external {
        require(isTeacher[msg.sender], "Only teacher can add grades");
        Student memory student = Student(
            _name,
            _gradeBiology,
            _gradeMath,
            _gradeEng
        );

        students.push(student);
    }

    function getGradeAverageStudent(uint256 _idStudent)
        external
        view
        returns (uint256)
    {
        return
            (students[_idStudent].gradeBiology +
                students[_idStudent].gradeMath +
                students[_idStudent].gradeEng) / 3;
    }

    function getGradeAverageOfClassInASubject(uint256 _subject)
        external
        view
        returns (uint256)
    {
        uint256 sum;
        require(_subject >= 1 && _subject < 4, "Subject does not exist");

        for (uint256 i; i < students.length; i++) {
            if (_subject == 1) {
                sum += students[i].gradeBiology;
            }
            if (_subject == 2) {
                sum += students[i].gradeEng;
            }
            if (_subject == 3) {
                sum += students[i].gradeMath;
            }
        }

        return sum / 3;
    }

    function getAverageGradeOfClass() external view returns (uint256) {
        uint256 sum;

        for (uint256 i; i < students.length; i++) {
            sum +=
                students[i].gradeBiology +
                students[i].gradeMath +
                students[i].gradeEng;
        }

        return sum / students.length;
    }
}
