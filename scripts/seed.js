// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
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
  const student2 = accounts[4]
  const student3 = accounts[5]

  const { chainId } = await ethers.provider.getNetwork()

  console.log(`Fetching Credentials contracts...`)

  const transcriptCred = await ethers.getContractAt('Credential', config[chainId].transcriptCred.address)
  console.log(`   transcriptCred contract fetched: ${transcriptCred.address}`)
  const diplomaCred = await ethers.getContractAt('Credential', config[chainId].diplomaCred.address)
  console.log(`   diplomaCred contract fetched:    ${diplomaCred.address}`)

  console.log(`\nFetching Academic Credentials contract...`)

  const academicCreds = await ethers.getContractAt('AcademicCreds', config[chainId].academicCreds.address)
  console.log(`   academicCreds contract fetched:  ${academicCreds.address}`)

  // register 2 schools with the academicCreds contract

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
/*
  console.log(`\nIssuing 2 Transcripts...`)

//  const URI1 = "https://ipfs.io/ipfs/QmTtYjAyLaznJCHjEyu3fE45b6gkb5pNmc55HbCQJ22EGn?filename=tscrp_00001.json";
  let URI1 = "http://bafybeidg3dbneqspndqmp75st32vsmcqeswoypvelijltmbfkwy52d6oxq.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school1).issueCredential(
                    student1.address, transcriptCred.address, URI1)
  await transaction.wait()
//  const URI2 = "https://ipfs.io/ipfs/QmbuyqceNYEqU7k6cdrfdxkMzkX4rujP9yov1Pzw91emmo?filename=tscrp_00002.json";
  let URI2 = "http://bafybeiers4kgihd5jefnyipgfepsiknzpfx3d7d3u6viwshx2yxuq7xhye.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school1).issueCredential(
                    student1.address, transcriptCred.address, URI2)
  await transaction.wait()

  let balance = await transcriptCred.balanceOf(student1.address)
  if (balance == 2) {
    console.log(`   Issued 2 Transcripts to: ${student1.address}`)
  } else {
    console.log(`   Failed to issue transcripts; balance = ${balance}\n`)
  }

  console.log(`\nIssuing 2 Diplomas...`)

//  const URI1 = "https://ipfs.io/ipfs/QmTtYjAyLaznJCHjEyu3fE45b6gkb5pNmc55HbCQJ22EGn?filename=tscrp_00001.json";
  URI1 = "http://bafybeihlrlknxdec75grfrjcnliuta6t62xye6zehejmx5g5aoikdqngbe.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school1).issueCredential(
                    student1.address, diplomaCred.address, URI1)
  await transaction.wait()
//  const URI2 = "https://ipfs.io/ipfs/QmbuyqceNYEqU7k6cdrfdxkMzkX4rujP9yov1Pzw91emmo?filename=tscrp_00002.json";
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
*/
  console.log(`\n-----     Done     -----\n\n\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
