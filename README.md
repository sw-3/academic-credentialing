# Acedemic Credentials Issued on Blockchain

This project is a proof-of-concept for a better way to issue and manage official academic transcripts and diplomas.

It is also a use case for the concept of "Soulbound Tokens" and is implemented as such.

## Components
The POC consists of 2 smart contracts and a web front end:
- AcademicCreds.sol is the controlling contract which issues and displays transcripts and diplomas.
- Credential.sol inherits from Openzeppelin's ERC721 NFT contract. It is deployed once for each type of credential; 'Transcript' and 'Diploma'.
- Academic Credentials Portal is the front end which talks to the AcademicCreds contract.

## Soulbound NFT Tokens

Credentials are unique to a single person and will not be sold or traded. Consequently, this POC overrides the ERC721 Approve and Transfer functions to prevent a Credential from being transferred out of the initial recipient's wallet. The token is "soulbound" to the recipient forever.

Enforcing this soulbound aspect on-chain establishes legitimate ownership, since a wallet can only possess credentials that were issued directly to them by a known school via the AcademicCreds contract.

## Process Overview
A school issues credentials as NFT tokens, via the web portal.  The Credential token is minted directly into a student's public blockchain account. Then the student (or others who need to see the student's credentials) will browse to the web portal to view the credentials in the student's account. Each NFT consists of the actual issued credential (a PDF file) and metadata which ensures validity (such as the issue date and account).

The issuing of "fake" credentials is prevented in 2 ways. First, only white-listed school accounts (registered with the AcademicCreds smart contract) can issue credentials on the contract. Second, the Credential contract's mint function is overridden, to only allow the AcademicCreds smart contract address to call it. And because data on a blockchain is immutable, a properly issued transcript cannot be modified later.

A Credential can be deleted by its owner, via the portal interface. This is accomplished throught the normal burn function provided by the OpenZeppelin NFT contract, and allows the owner to delete old un-needed credentials out of their wallet.


## Installation

This is a Hardhat/Solidity project running React.js on the front end. It was bootstrapped with create-react-app.

### Prerequisites
- node.js:  This project was built with v 9.6.2.  Run `npm -v` to see your version of node.
- hardhat:  This project is using v 2.14.0.  Run `npx hardhat --version` to see your version.

### Steps
1. Clone the repo onto your local machine, and cd to the main directory.
2. Run `npm install`
3. Run `npx hardhat test` to compile the smart contracts and run their tests. If things are working, you should see 24 passing tests.

