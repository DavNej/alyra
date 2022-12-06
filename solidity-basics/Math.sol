// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// ^0.8.2; works from 0.8.2 to 0.9.0 excluded
// >=0.4.16 <0.8.2;

contract Math {
    int256 public number;

    function setNumber(int256 _number) external {
        number = _number;
    }

    function add(int256 a, int256 b) external {
        this.setNumber(a + b);
    }

    function substract(int256 a, int256 b) external {
        this.setNumber(a - b);
    }

    function multiply(int256 a, int256 b) external {
        this.setNumber(a * b);
    }

    function divide(int256 a, int256 b) external {
        this.setNumber(a / b);
    }

    function modulo(int256 a, int256 b) external {
        this.setNumber(a % b);
    }
}
