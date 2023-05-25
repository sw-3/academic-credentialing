/* seed.js
**
** Academic Credentials script to seed the contracts with some data
**
** IMPORTANT NOTES:

** 1) This is configured to run locally in the Hardhat environment!
** 2) All contracts must first be deployed via the deploy.js script.
** 3) 2 school accounts are registered, using Hardhat accounts #1 and #2.
** 3) See Note below on how to correctly seed Credentials with IPFS.
**
** Run the script with `npx hardhat run --network localhost seed.js`.
*/
const hre = require("hardhat");
const config = require('../src/config.json')

async function main() {
  console.log(`\n\nSeeding Schools and Credentials for AcademicCreds contract... \n`)

  console.log(`Fetching accounts & network \n`)
  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const school1 = accounts[1]
  const school2 = accounts[2]
  const student1 = accounts[3]

  const { chainId } = await ethers.provider.getNetwork()

  console.log(`Fetching Credentials contracts...`)

  const transcriptCred = await ethers.getContractAt('Credential', config[chainId].transcriptCred.address)
  console.log(`   transcriptCred contract fetched: ${transcriptCred.address}`)
  const diplomaCred = await ethers.getContractAt('Credential', config[chainId].diplomaCred.address)
  console.log(`   diplomaCred contract fetched:    ${diplomaCred.address}`)

  console.log(`\nFetching Academic Credentials contract...`)

  const academicCreds = await ethers.getContractAt('AcademicCreds', config[chainId].academicCreds.address)
  console.log(`   academicCreds contract fetched:  ${academicCreds.address}`)

  // register 2 schools with the academicCreds contract.

  let transaction, retrievedName, isSchool
  const schoolName1 = "Great State University"
  const schoolName2 = "Great Institute of Technology"

  console.log(`\nRegistering 2 schools...`)
  transaction = await academicCreds.connect(deployer).registerSchool(school1.address, schoolName1)
  await transaction.wait()
  transaction = await academicCreds.connect(deployer).registerSchool(school2.address, schoolName2)
  await transaction.wait()

  retrievedName = await academicCreds.registeredSchools(school1.address)
  isSchool = await academicCreds.isSchool(school1.address)
  if (isSchool) {
    console.log(`   ${retrievedName} registered successfully: ${school1.address}.`)
  } else {
    console.log(`   Registration of school 1 failed.\n`)
  }
  retrievedName = await academicCreds.registeredSchools(school2.address)
  isSchool = await academicCreds.isSchool(school2.address)
  if (isSchool) {
    console.log(`   ${retrievedName} registered successfully: ${school2.address}.`)
  } else {
    console.log(`   Registration of school 2 failed.\n`)
  }


/******************************************************************************
** NOTE:
** To issue Transcripts & Diplomas, you must first store the data in IPFS.
**
** 1) store the PDF file of the credential in IPFS, and get the URI
** 2) add the URI from step 1 to the .json metadata for the credential as the
**    "credential_image" value
** 3) store the .json metadata in IPFS and get the URI of the metadata
** 4) set the URI value below to the URI from step 3
**
** Alternatively, you can comment out the issue of transcripts & diplomas
** below, and issue them via the school accounts connected to the frontend.
** (You still need to store the metadata/PDF on IPFS first, step 1-3 above)
**
******************************************************************************/
  console.log(`\nIssuing 3 Transcripts...`)

  let URI1 = "http://bafybeifphaorkxx5rua3tfv5aotjwljtnhb4u4sa6mbeqo4f2ocym54jfq.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school1).issueCredential(
                    student1.address, transcriptCred.address, URI1)
  await transaction.wait()

  let URI2 = "http://bafybeiccgw7uplj7el6wnwfkjyqxwhb3nn42limp6oxzrx7b2akr736voq.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school1).issueCredential(
                    student1.address, transcriptCred.address, URI2)
  await transaction.wait()

  let URI3 = "http://bafybeieeaudzkzzrhw3jghqiwzs2axesjjtcfmdyqmgjxlkp7nnab6dgnm.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school1).issueCredential(
                    student1.address, transcriptCred.address, URI3)
  await transaction.wait()

  let balance = await transcriptCred.balanceOf(student1.address)
  if (balance == 3) {
    console.log(`   Issued 3 Transcripts to: ${student1.address}`)
  } else {
    console.log(`   Failed to issue transcripts; balance = ${balance}\n`)
  }

  console.log(`\nIssuing 2 Diplomas...`)

  URI1 = "http://bafybeihlrlknxdec75grfrjcnliuta6t62xye6zehejmx5g5aoikdqngbe.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school1).issueCredential(
                    student1.address, diplomaCred.address, URI1)
  await transaction.wait()
  URI2 = "http://bafybeicm43jt7jieyknlvqxlztdeomw3vtyapbvp4n4auxyvf5hc5dtoxe.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school2).issueCredential(
                    student1.address, diplomaCred.address, URI2)
  await transaction.wait()

  balance = await diplomaCred.balanceOf(student1.address)
  if (balance == 2) {
    console.log(`   Issued 2 Diplomas to: ${student1.address}\n`)
  } else {
    console.log(`   Failed to issue diplomas; balance = ${balance}\n`)
  }

  console.log(`\n-----     Done     -----\n\n\n`)
}

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
