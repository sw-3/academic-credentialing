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
    mapping(address => uint256) public registeredSchools;
    // Every student who receives a credential will get an ID > 0
    mapping(address => uint256) public registeredStudents;

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
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    // allow the owner to register schools into the system
    function registerSchool(address account) public onlyOwner 
        returns (uint256)
    {
        if (registeredSchools[account] == 0) 
        {
            registeredSchools[account] = NEXT_SCHOOL_ID;
            NEXT_SCHOOL_ID++;
        }

        return registeredSchools[account];
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        // ensure minter is in the system
        require(registeredSchools[msg.sender] > 0, "Must have an ID to issue a token");

        // add receiving account to the registered students
        if (registeredStudents[account] == 0) {
            registeredStudents[account] = NEXT_STUDENT_ID;
            NEXT_STUDENT_ID++;
        }

        _mint(account, id, amount, data);
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

        return false;
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
