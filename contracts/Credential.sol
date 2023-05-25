// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// ----------------------------------------------------------------------------
// Credential.sol
//
// A contract to manage a type of Academic Credential issued on the blockchain
//
// This contract inherits from openZeppelin's ERC721.sol and extensions, with
// the following modifications:
//
//      - implements a 'soulbound' version of ERC721
//      - enforces minting only from a controlling contract address
// ----------------------------------------------------------------------------

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Credential is ERC721,
                        ERC721Enumerable,
                        ERC721URIStorage,
                        ERC721Burnable,
                        Ownable
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address public academicCredsAddress;

    constructor
        (
            string memory _name,
            string memory _symbol
        )
        ERC721(_name, _symbol) {}

    // modifier to enforce that only 'academicCredsAddress' can mint
    modifier onlyAcademicCreds() {
        require(
            msg.sender == academicCredsAddress,
            "Not authorized to mint."
        );
        _;
    }

    // function to set the 'academicCredsAddress' used in above modifier
    function setAcademicCredsAddress(address _address) public onlyOwner {
        academicCredsAddress = _address;
    }

    // the mint function can only be called via the AcademicCreds contract
    function safeMint(address to, string memory uri) public onlyAcademicCreds {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // function to return list of Credentials owned by an account
    function walletOfOwner(address _owner) public view returns(uint256[] memory) {

        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);

        for(uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    // the following functions are overrides required by Solidity, and are
    // provided by the openzeppelin implementation

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // ------------------------------------------------------------------------
    // The following override functions implement 'souldbound' tokens.
    //      - No approving other accounts to act on the tokens
    //      - No transfers allowed
    // ------------------------------------------------------------------------

    function approve(address _approved, uint256 _tokenId)
        public override(ERC721, IERC721)
    {
        // not allowing approvals for soulbound tokens
        require(_approved == address(0), 'Cannot approve transfers of Credential tokens.');

        // if _approved is 0 address, reaffirms that no address is approved
        super.approve(_approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved)
        public override(ERC721, IERC721)
    {
        // do not allow approvals for soulbound tokens
        require(_approved == false, 'Cannot approve transfers of Credential tokens.');

        // if false then reaffirm revoking all approval
        super.setApprovalForAll(_operator, _approved);
    }

    function safeTransferFrom
        (
            address _from,
            address _to,
            uint256 _tokenId,
            bytes memory data
        )
        public override(ERC721, IERC721)
    {
        // do not allow tranfers for soulbound tokens
        require(_to == address(0), 'Cannot transfer Credential tokens.');

        // if _to is the 0 address, this will also throw
        super.safeTransferFrom(_from, _to, _tokenId, data);
    }

    function safeTransferFrom
        (
            address _from,
            address _to,
            uint256 _tokenId
        )
        public override(ERC721, IERC721)
    {
        // do not allow tranfers for soulbound tokens
        require(_to == address(0), 'Cannot transfer Credential tokens.');

        // if _to is the 0 address, this will also throw
        super.safeTransferFrom(_from, _to, _tokenId);
    }

    function transferFrom
        (
            address _from,
            address _to,
            uint256 _tokenId
        )
        public override(ERC721, IERC721)
    {
        // do not allow tranfers for soulbound tokens
        require(_to == address(0), 'Cannot transfer Credential tokens.');

        // if _to is the 0 address, this will also throw
        super.safeTransferFrom(_from, _to, _tokenId);
    }
}
