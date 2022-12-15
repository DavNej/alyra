// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract GuessWord is Ownable {
    string private wordToGuess;
    string private clue;
    address winner;

    mapping(address => bool) hasAlreadyPlayed;

    function setWordToGuess(string memory _newWord) external onlyOwner {
        wordToGuess = _newWord;
    }

    function setClue(string memory _clue) external onlyOwner {
        clue = _clue;
    }

    function getClue() external view returns (string memory) {
        return clue;
    }

    function guess(string memory _guess) external returns (bool) {
        require(!hasAlreadyPlayed[msg.sender], "Player has already played");

        hasAlreadyPlayed[msg.sender] = true;

        bool isGoodGuess = keccak256(abi.encodePacked(_guess)) ==
            keccak256(abi.encodePacked(wordToGuess));

        if (isGoodGuess) {
            winner = msg.sender;
        }

        return isGoodGuess;
    }

    function getWinner() external view returns (address) {
        return winner;
    }
}
