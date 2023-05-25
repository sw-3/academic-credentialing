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

A Credential can be deleted by its owner, via the portal interface. This is accomplished throught the normal burn function provided by the OpenZeppelin NFT contract, and allows the owner to delete old un-needed credentials out of their wallet and off the blockchain.


## Install and Run Locally - beware this section is "in progress"!!!

This is a Hardhat/Solidity project running React.js on the front end. It was bootstrapped with create-react-app.

### Prerequisites
- **node.js v16.X:**  This project was built with v 16.14.2.  Run `node -v` to see your version of node.
- **nvm:**  This project was built with v 0.39.3.  Run `nvm -v` to see your version of nvm.
- **npm:**  This project was built with v 9.6.2.  Run `npm -v` to see your version of npm.
- **hardhat:**  This project is using v 2.14.0.  Run `npx hardhat --version` to see your version.
- **solidity v0.8.18:**  This should be set in the hardhat.config.js file.

### Install and Validate Smart Contracts
1. In a terminal session:  Clone the repo onto your local machine, and cd to the main directory.
2. On the command line, Enter `npm install`
3. Enter `npx hardhat test` to compile the smart contracts and run their tests.

If things are working, you should see 24 passing tests, for AcademicCreds & Credential contracts.

### Run the POC Locally
1. In a terminal session:  Enter `npx hardhat node` to launch a blockchain node on your computer
2. In a 2nd terminal session:  Enter `npx hardhat run --network localhost ./scripts/deploy.js`

After the above, you should see output for 3 contracts deployed, and a configuration step for the 2 Credential contracts.  In the terminal window that is running the blockchain node, you should see that the deploy/configure transactions ran successfully.

Your blockchain is now running locally with the Academic Credentials contracts deployed!

3. Back in the 2nd terminal:  Enter `npx hardhat run --network localhost ./scripts/seed.js`

You should see output like this:
`Registering 2 schools...
   Great State University registered successfully: 0x...
   Great Institute of Technology registered successfully: 0x...`
Note the account addresses, these are the 2 school accounts which can issue transcripts and diplomas to other accounts.



