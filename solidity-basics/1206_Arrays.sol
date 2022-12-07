// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Simple contract explore arrays
contract Arrays {
    uint256[] public numbers;

    function addNumber(uint256 _number) public {
        numbers.push(_number);
    }

    function updateNumber(uint256 _index, uint256 _number) public {
        numbers[_index] = _number;
    }

    function deleteNumber(uint256 _index) public {
        delete numbers[_index]; // delete will replace value by 0. It will not really delete it
    }

    function getLength() public view returns (uint256) {
        return numbers.length;
    }

    function doubleValues() public view returns (uint256[] memory) {
        uint256 length = numbers.length;
        uint256[] memory results = new uint256[](length);
        for (uint256 i = 0; i < length; i++) {
            results[i] = numbers[i] * 2;
        }
        return results;
    }

    function sumValuesOfArray(uint256[] memory array)
        public
        pure
        returns (uint256)
    {
        uint256 length = array.length;
        uint256 sum = 0;
        for (uint256 i = 0; i < length; i++) {
            sum += array[i];
        }

        return sum;
    }

    function multiplyByTen(uint256[] memory array)
        public
        pure
        returns (uint256[] memory)
    {
        uint256 length = array.length;
        uint256[] memory result = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            result[i] = array[i] * 10;
        }

        // OR

        // uint256 j = 0;
        // while (j < length) {
        //     result[j] = array[j] * 10;
        //     j++;
        // }

        return result;
    }
}
