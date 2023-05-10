// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AcademicCreds is Ownable {

    // set up incremental unique ID assignment for Schools and Students
    // usage:
    //      uint256 schoolID = _schoolIdCounter.current();
    //      _schoolIdCounter.increment();
    // ------------------------------------------------------------------------
    using Counters for Counters.Counter;
    Counters.Counter private _schoolIdCounter;
    Counters.Counter private _studentIdCounter;


    ///////////////////////////////////////////////////////////////////////////
    //
    //  EVERYTHING BELOW HERE NEEDS TO BE REWORKED!!!
    //
    ///////////////////////////////////////////////////////////////////////////


    // Manage 2 different NFT tokens representing types of academic credentials
    uint256 public constant TRANSCRIPT = 0;
    uint256 public constant DIPLOMA = 1;

    uint256 public NEXT_SCHOOL_ID = 1;
    uint256 public NEXT_STUDENT_ID = 1;

    string public baseURI;

    // Every school registered with the system will get an ID > 0
    mapping(address => string) public registeredSchools;
    // Every student who receives a credential will get an ID > 0
    mapping(address => uint256) public registeredStudents;

    event RegisterSchool(address account, string schoolName);

    constructor() {

        // We may need to use the IPFS node URI here as a base URI !!??
        // baseURI = _baseURI;

        // Code goes here...  nothing else needed to initialize on deploy??

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
    // Allows a school to issue a transcript or diploma to a student.
    // (Utilizes the openZeppelin ERC1155 token _mint() function.)
    // ------------------------------------------------------------------------
    function issueCredential
        (
            address _account,
            uint256 _id,
            bytes memory _data
        )
        public
    {
        // ensure minter is a registered school
        require(isSchool(msg.sender), "Must be a registered school.");

        uint256 amount = 1;  // issues 1 credential at a time

        // add receiving account to the registered students
        if (registeredStudents[_account] == 0) {
            registeredStudents[_account] = NEXT_STUDENT_ID;
            NEXT_STUDENT_ID++;
        }

        //_mint(_account, _id, amount, _data);
    }
}
