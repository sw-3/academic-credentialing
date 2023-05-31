# Acedemic Credentials Issued on Blockchain

This project is a proof-of-concept for a better way to issue and manage official academic transcripts and diplomas.

It is also a use case for the concept of "Soulbound Tokens" and is implemented as such.

## Contents
[Credentials As Soulbound NFT Tokens](#soulbound)
[The Credentialing Process](#process)
[Project Components](#components)
[Technologies Used](#tech)
[Installation](#install)
[Run the POC Locally](#run_local)
[Launch The Front End](#front_end)
[Before Issuing Credentials](#fbefore)

## Credentials As *Soulbound* NFT Tokens {#soulbound}
Credentials are unique to a single person and will not be sold or traded. Consequently, this POC overrides the ERC721 Approve and Transfer functions to prevent a Credential from being transferred out of the initial recipient's wallet. The token is "soulbound" to the recipient forever.

Enforcing this soulbound aspect on-chain *establishes legitimate ownership*, because a wallet can only possess credentials that were issued directly to it by a known school via the AcademicCreds contract.

I implemented an owner-only method to **delete** un-needed credentials from their wallet and off the blockchain. A student receives a transcript every semester, but they most likely need to retain only the latest transcript from a school. Deleting an old credential is accomplished throught the normal burn function provided by the OpenZeppelin NFT contract

## The Credentialing Process {#process}
A school issues credentials as NFT tokens, via the *Academic Credentials Portal* website.  The Credential token is minted directly into a student's blockchain account. Then the student (or others who need to see the student's credentials) will browse to the web portal to view the credentials in the student's account. Each NFT consists of the actual issued credential (a PDF file) and metadata which ensures validity (such as the issue date and issuer account).

"Fake" credentials are prevented in the following ways.
- Only white-listed school accounts (registered with the AcademicCreds smart contract) can issue credentials on the contract.
- The Credential contract's *mint* function is overridden, to only allow the AcademicCreds smart contract address to call it.  If any account other than the controlling contract calls the *mint* function, it will fail.
- Because data on a blockchain is immutable, a properly issued transcript or diploma cannot be modified later.

## Project Components {#components}
The POC consists of 2 smart contracts and a web front end:
- **AcademicCreds.sol** is the controlling contract which issues and displays transcripts and diplomas.
- **Credential.sol** inherits from Openzeppelin's ERC721 NFT contract. It is deployed once for each type of credential; 'Transcript' and 'Diploma'.
- **Academic Credentials Portal** is the front end which talks to the AcademicCreds contract.

## Technologies Used {#tech}
- **react.js**  This project was built with v 18.2.0
- **node.js v16.X:**  This project was built with v 16.14.2.  Run `node -v` to see your version of node.
- **nvm:**  This project was built with v 0.39.3.  Run `nvm -v` to see your version of nvm.
- **npm:**  This project was built with v 9.6.2.  Run `npm -v` to see your version of npm.
- **hardhat:**  This project is using v 2.14.0.  Run `npx hardhat --version` to see your version.
- **solidity:**  Built with v0.8.18; this should be set in the *hardhat.config.js* file.

## Installation {#install}
This is a Hardhat/Solidity project running React.js on the front end. It was bootstrapped with *create-react-app*.

1. In a terminal session:  Clone the repo onto your local machine, and cd to the main directory.
2. On the command line, Enter `npm install`
3. Enter `npx hardhat test` to compile the smart contracts and run their tests.

If things are working, you should see 24 total passing tests, for the AcademicCreds & Credential contracts.

## Run the POC Locally {#run_local}
1. In a terminal session:  Enter `npx hardhat node` to launch a blockchain node on your computer
2. In a 2nd terminal session:  Enter `npx hardhat run --network localhost ./scripts/deploy.js`

After the above, you should see output for 3 contracts deployed, and a configuration step for the 2 Credential contracts.  In the terminal window that is running the blockchain node, you should see that the deploy & configure transactions ran successfully.

Your blockchain is now running locally with the Academic Credentials contracts deployed!

**IMPORTANT NOTE:** Compare the 3 deployed contract addresses on the terminal screen, with the first 3 addresses in the **./src/config.json** file. The addresses in the file MUST match the addresses on the screen in this step. If they do not match, *correct the addresses in the config.json file now*.

3. Back in the 2nd terminal:  Enter `npx hardhat run --network localhost ./scripts/seed.js`

You should see output for fetching the 3 deployed contracts, followed by "Registering 2 schools..."
Note the account addresses of the 2 schools; these are the 2 school accounts which can issue transcripts and diplomas to other accounts.

4. You can add the Hardhat network (chainId is 31337) to your Metamask wallet, and import the 2 school account addresses to use them.

## Launch The Front End {#front_end}
In a 3rd terminal window:  Enter `npm run start`
This will launch a browser window to display the Academic Credentials Portal application. You must have Metamask (or a compatible wallet) installed in your browser, and within Metamask connect to the local Hardhat network (chainId is 31337).

Finally press the blue **Connect** button in the upper right corner of the Portal.

## Before Issuing Credentials {#before}
There are 2 example Diplomas, and 5 example Transcripts, included in these 2 directories:
- example_images/  contains the PDF files
- example_metadata/ contains the related .json files

These example credentials need to be stored in IPFS properly, so you can enter the IPFS URI location on the Issue Transcripts/Diplomas tabs. *See the* **./scripts/seed.js** *file for details on how to do this step.*

You can use the *IPFS Desktop* app to run a local IPFS node for this step, and use the "Local Gateway" address for the URI. This allows you to run everything locally and also store the data locally.
