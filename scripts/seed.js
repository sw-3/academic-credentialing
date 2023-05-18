// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const config = require('../src/config.json')

async function main() {
  console.log(`\nFetching accounts & network \n`)
  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const school1 = accounts[1]
  const school2 = accounts[2]
  const student1 = accounts[3]
  const student2 = accounts[4]
  const student3 = accounts[5]

  const { chainId } = await ethers.provider.getNetwork()

  console.log(`\nFetching Credentials contracts... \n`)

  const transcriptCred = await ethers.getContractAt('Credential', config[chainId].transcriptCred.address)
  console.log(`   transcriptCred contract fetched: ${transcriptCred.address}\n`)
  const diplomaCred = await ethers.getContractAt('Credential', config[chainId].diplomaCred.address)
  console.log(`   diplomaCred contract fetched: ${diplomaCred.address}\n`)

  console.log(`\nFetching Academic Credentials contract... \n`)

  const academicCreds = await ethers.getContractAt('AcademicCreds', config[chainId].academicCreds.address)
  console.log(`   academicCreds contract fetched: ${academicCreds.address}\n`)

  // register a school with the academicCreds contract

  let transaction
  const schoolName = "Great State University"

  console.log(`\nRegistering a school...\n`)
  transaction = await academicCreds.connect(deployer).registerSchool(school1.address, schoolName)
  await transaction.wait()

  const retrievedName = await academicCreds.registeredSchools(school1.address)
  const isSchool = await academicCreds.isSchool(school1.address)
  if (isSchool) {
    console.log(`   ${retrievedName} registered successfully: ${school1.address}.\n`)
  } else {
    console.log(`   Registration failed.\n`)
  }

  console.log(`\nIssuing 2 Transcripts...\n`)

//  const URI1 = "https://ipfs.io/ipfs/QmTtYjAyLaznJCHjEyu3fE45b6gkb5pNmc55HbCQJ22EGn?filename=tscrp_00001.json";
  const URI1 = "http://bafybeidg3dbneqspndqmp75st32vsmcqeswoypvelijltmbfkwy52d6oxq.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school1).issueCredential(
                    student1.address, transcriptCred.address, URI1)
  await transaction.wait()
//  const URI2 = "https://ipfs.io/ipfs/QmbuyqceNYEqU7k6cdrfdxkMzkX4rujP9yov1Pzw91emmo?filename=tscrp_00002.json";
  const URI2 = "http://bafybeiers4kgihd5jefnyipgfepsiknzpfx3d7d3u6viwshx2yxuq7xhye.ipfs.localhost:8080/";
  transaction = await academicCreds.connect(school1).issueCredential(
                    student1.address, transcriptCred.address, URI2)
  await transaction.wait()

  const balance = await transcriptCred.balanceOf(student1.address)
  if (balance == 2) {
    console.log(`   Issued 2 Transcripts to: ${student1.address}\n`)
  } else {
    console.log(`   Failed to issue transcripts; balance = ${balance}\n`)
  }

  console.log(`\nDone.\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
