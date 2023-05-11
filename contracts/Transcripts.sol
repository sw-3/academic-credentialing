// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Transcripts is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address internal academicCredsAddress;

    constructor(address _academicCredsAddress) ERC721("Transcripts", "TSCRP") {
        academicCredsAddress = _academicCredsAddress;
    }

    // modifier to enforce who can mint
    modifier onlyAcademicCreds() {
        require(
            msg.sender == academicCredsAddress,
            "Not authorized to mint."
        );
        _;
    }

    function safeMint(address to, string memory uri) public onlyAcademicCreds {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

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

    // The following override standard functions to implement 'souldbound' tokens
    // --------------------------------------------------------------------------

    function approve(address _approved, uint256 _tokenId)
        public override(ERC721, IERC721)
    {
        // not allowing approvals for soulbound transcript tokens
        require(_approved == address(0), 'Cannot approve transcript token.');

        // if _approved is 0 address, reaffirms that no address is approved
        super.approve(_approved, _tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved)
        public override(ERC721, IERC721)
    {
        // do not allow approvals for soulbound transcript tokens
        require(_approved == false, 'Cannot approve transcript tokens.');

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
        // do not allow tranfers for soulbound transcript tokens
        require(_to == address(0), 'Cannot transfer transcript token.');

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
        // do not allow tranfers for soulbound transcript tokens
        require(_to == address(0), 'Cannot transfer transcript token.');

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
        // do not allow tranfers for soulbound transcript tokens
        require(_to == address(0), 'Cannot transfer transcript token.');

        // if _to is the 0 address, this will also throw
        super.safeTransferFrom(_from, _to, _tokenId);
    }
}
