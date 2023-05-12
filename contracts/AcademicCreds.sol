// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// ----------------------------------------------------------------------------
// AcademicCreds.sol
//
// A custom contract to manage the issuing of Academic Credentials
//
// Two types of credentials are implemented - transcript and diploma. Each is
// represented by a 'soulbound' NFT which can be issued to a student account.
// ----------------------------------------------------------------------------

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import Credential contract - a soulbound version of ERC721
import "./Credential.sol";

contract AcademicCreds is Ownable {

    // This contract manages 2 types of Credential: transcript & diploma
    Credential public transcriptCred;
    Credential public diplomaCred;

    // Every school registered with the system will go in the mapping
    mapping(address => string) public registeredSchools;

    // ----- NOT IMPLEMENTED FOR MVP FUNCTIONALITY ----------------------------
    //
    // Every student who receives a credential will get an ID in a mapping
    //mapping(address => uint256) public registeredStudents;
    //
    // set up incremental unique ID assignment for Schools and Students
    //using Counters for Counters.Counter;
    //Counters.Counter private _schoolIdCounter;
    //Counters.Counter private _studentIdCounter;
    //
    //string public baseURI;  // not sure this is needed?
    // ------------------------------------------------------------------------

    // event definitions
    event RegisterSchool(address account, string schoolName);
    event IssueCredential(string credName, address account, string uri);

    constructor(Credential _transcriptCred, Credential _diplomaCred) {
        // connect to credential tokens
        transcriptCred = _transcriptCred;
        diplomaCred = _diplomaCred;
    }

    // modifier to enforce who can issue credentials
    modifier onlySchool() {
        require(isSchool(msg.sender), "Must be a registered school.");
        _;
    }

    // function to compare 2 strings; if equal returns true
    function _compareStrs
        (
            string memory str1,
            string memory str2
        )
        internal pure returns (bool)
    {
        if (bytes(str1).length != bytes(str2).length) {
            return false;
        }
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }

    // allow contract owner to register schools into the system
    function registerSchool
        (
            address _account,
            string memory _schoolName
        )
        public onlyOwner
    {
        // must provide a name
        require(!_compareStrs(_schoolName, ""), "Must provide a school name.");

        // must not be account 0
        require(_account != address(0), "Invalid account provided.");

        // add school acount/name to the mapping
        registeredSchools[_account] = _schoolName;

        // emit event
        emit RegisterSchool(_account, _schoolName);
    }

    function isSchool(address _account) public view returns (bool)
    {
        return (!_compareStrs(registeredSchools[_account], ""));
    }

    // function issueCredential
    // ------------------------------------------------------------------------
    // Issue a transcript or diploma to a student.
    // Calls the credential token safeMint() function.
    // ------------------------------------------------------------------------
    function issueCredential
        (
            address _account,
            Credential _credential,
            string memory _uri
        )
        public onlySchool
    {
        string memory credName = _credential.name();

        _credential.safeMint(_account, _uri);

        emit IssueCredential(credName, _account, _uri);
    }
}
