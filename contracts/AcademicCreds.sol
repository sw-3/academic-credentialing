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
    function compareStrs
        (
            string memory str1,
            string memory str2
        )
        public pure returns (bool)
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
        require(!compareStrs(_schoolName, ""), "Must provide a school name.");

        // must not be account 0 -- fix this!
        //require(_account != "0x0", "Invalid account provided.");

        // add school acount/name to the mapping
        registeredSchools[_account] = _schoolName;

        // emit event
        emit RegisterSchool(_account, _schoolName);
    }

    function isSchool(address _account) public view returns (bool)
    {
        return (!compareStrs(registeredSchools[_account], ""));
    }

    function mint
        (
            address _account,
            uint256 _id,
            uint256 _amount,
            bytes memory _data
        )
        public onlyOwner
    {
        // ensure minter is a registered school
        require(isSchool(msg.sender), "Must be a registered school.");

        // add receiving account to the registered students
        if (registeredStudents[_account] == 0) {
            registeredStudents[_account] = NEXT_STUDENT_ID;
            NEXT_STUDENT_ID++;
        }

        _mint(_account, _id, _amount, _data);
    }

    // I don't *think* we need mintBatch .. a school is issuing 1 credential at a time?
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
        public override
    {
        // might rewrite this to approve for VIEWING the tokens only??
        // otherwise, should just fail with error

        // if operator != msg.sender
        //      fail here ...
        // else
        //      it will fail in the openZeppelin parent

    }

    function isApprovedForAll(address account, address operator)
        public view override
        returns (bool)
    {
        // if we use approvals for VIEWING the tokens, this will return true

        // if we don't use approvals at all, this should just return false

        //return false;
    }

    function safeTransferFrom
        (
            address from,
            address to,
            uint256 id,
            uint256 amount,
            bytes memory data
        )
        public override
    {

        // Transfer functions should fail; 'token is not transferrable'
        // if 'to' != '0x0' then
        //      fail here ...
        // else
        //      it will fail in the openZeppelin parent

    }


    function safeBatchTransferFrom
        (
            address from,
            address to,
            uint256[] memory ids,
            uint256[] memory amounts,
            bytes memory data
        )
        public override
    {
        // Transfer functions should fail; 'token is not transferrable'
        // if 'to' != '0x0' then
        //      fail here ...
        // else
        //      it will fail in the openZeppelin parent

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
