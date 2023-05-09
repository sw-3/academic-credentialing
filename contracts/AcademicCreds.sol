// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract AcademicCreds is ERC1155, Ownable {

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

    constructor(
        string memory _baseURI
    ) ERC1155(_baseURI) {

        //   ERC1155(uri)   ... the uri is for a "base" URI for the metadata.
        //                      will we have a URI since using IPFS hash for
        //                      each individual NFT token?
        //                      We may need to use the IPFS node URI here!!??
        baseURI = _baseURI;

        // Code goes here...  nothing else needed to initialize on deploy??

    }

    // allows owner to update the base URI where metadata is located
    // this will only be needed if the base URI is an IPFS node that could change
    function setURI(string memory _newuri) public onlyOwner {
        _setURI(_newuri);
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

        _mint(_account, _id, amount, _data);
    }

    // No need for mintBatch ... a school issues 1 credential at a time
    //
    // function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
    //     public
    //     onlyOwner
    // {
    //     _mintBatch(to, ids, amounts, data);
    // }




    ///////////////////////////////////////////////////////////////////////////
    //
    // OVER-RIDE STANDARD ERC1155 FUNCTIONS FOR SOULBOUND PROPERTIES
    //

    function setApprovalForAll(address operator, bool approved)
        public pure override
    {
        // NOTE: might rewrite this to approve for VIEWING the tokens only

        // 'Approval' will just fail with error in this contract
        // Thus, isApprovedForAll can be called but will always return false.

        require(operator == address(0), "Approvals not supported for academic credentials.");
    }


    function safeTransferFrom
        (
            address from,
            address to,
            uint256 id,
            uint256 amount,
            bytes memory data
        )
        public pure override
    {
        // Soulbound Tokens cannot be transferred

        require(from == address(0), "Transfers not supported for academic credentials.");
    }


    function safeBatchTransferFrom
        (
            address from,
            address to,
            uint256[] memory ids,
            uint256[] memory amounts,
            bytes memory data
        )
        public pure override
    {
        // Soulbound Tokens cannot be transferred

        require(from == address(0), "Transfers not supported for academic credentials.");
    }




    // Soulbound burns:
    // --------------------------------------------------------------------
    // Would like to allow a token holder to "burn" their academic tokens.
    //
    // Openzeppelin has an ERC1155 extension for burnable tokens, but it
    // allows "approved" accounts to burn tokens in other accounts.
    //
    // Since our Soulbound version does not utilize Approvals in this way,
    // it is best to create our own burn functions that enforces only
    // burning one's own tokens.
    //
    // We will also want to burn a "specific" transcript or diploma,
    // rather than an amount of them.


    function burn(address from, uint256 id, uint256 amount)
        public
    {

        //      Code goes here ...


        // Enforced by the internal _burn() from openZeppelin:
        //      'from' cannot be the zero address
        //      'from' must have at least 'amount' tokens of type 'id'
        //      emits a TransferSingle event
        _burn(from, id, amount);
    }

    function burnBatch(address from, uint256[] memory ids, uint256[] memory amounts)
        public
    {
        // batched version of burn

        //      Code goes here...


        // Enforced by the internal _burnBatch:
        //      'from' cannot be the zero address
        //      'ids' and 'amounts' must have the same length
        //      'from' must have at least the amount of each type listed
        _burnBatch(from, ids, amounts);
    }

}
