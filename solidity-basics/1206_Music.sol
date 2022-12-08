// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// Reggae
// Bob Marley, One love, 60
// Bob Marley, Redemption song, 60
// Jehro, Everything, 120

error Music__IsNotOwner();
error Music__IsPaused();

contract Music {
    struct Track {
        string artist;
        string title;
        uint256 bpm;
    }

    struct Playlist {
        string name;
        Track[] tracks;
    }

    mapping(address => Playlist) public playlists;

    address immutable i_owner;
    bool public paused;

    constructor() {
        i_owner = msg.sender;
    }

    modifier ownerOnly() {
        if (msg.sender != i_owner) {
            revert Music__IsNotOwner();
        }
        _;
    }

    modifier notPaused() {
        if (paused) {
            revert Music__IsPaused();
        }
        _;
    }

    function addPlaylist(string memory _name) public notPaused {
        playlists[msg.sender].name = _name;
    }

    function addTrackToMyPlaylist(
        string memory _artist,
        string memory _title,
        uint256 _bpm
    ) public notPaused {
        Track memory track = Track(_artist, _title, _bpm);
        playlists[msg.sender].tracks.push(track);
    }

    function getPlaylist() public view notPaused returns (Playlist memory) {
        return playlists[msg.sender];
    }

    // Owner only functions
    function setPause(bool _paused) external ownerOnly {
        paused = _paused;
    }

    function addTrackToPlaylist(
        address _user,
        string memory _artist,
        string memory _title,
        uint256 _bpm
    ) external notPaused ownerOnly {
        Track memory track = Track(_artist, _title, _bpm);
        playlists[_user].tracks.push(track);
    }
}
