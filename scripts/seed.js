// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const config = require('../src/config.json')

async function main() {
  console.log(`Fetching accounts & network \n`)
  const accounts = await ethers.getSigners()
  const deployer = accounts[0]
  const school1 = accounts[1]
  const school2 = accounts[2]
  const student1 = accounts[3]
  const student2 = accounts[4]
  const student3 = accounts[5]

  const { chainId } = await ethers.provider.getNetwork()

  console.log(`Fetching Credentials... \n`)

  const transcriptCred = await ethers.getContractAt('Credential', config[chainId].transcriptCred.address)
  console.log(`   transcriptCred contract fetched: ${transcriptCred.address}\n`)
  const diplomaCred = await ethers.getContractAt('Credential', config[chainId].diplomaCred.address)
  console.log(`   diplomaCred contract fetched: ${diplomaCred.address}\n`)

  console.log(`Fetching Academic Credentials contract... \n`)

  const academicCreds = await ethers.getContractAt('AcademicCreds', config[chainId].academicCreds.address)
  console.log(`   academicCreds contract fetched: ${academicCreds.address}\n`)

  // register a school with the academicCreds contract

  let transaction
  const schoolName = "Montana State University"

  console.log(`Registering a school...\n`)
  transaction = await academicCreds.connect(deployer).registerSchool(school1.address, schoolName)
  await transaction.wait()

  const retrievedName = await academicCreds.registeredSchools(school1.address)
  const isSchool = await academicCreds.isSchool(school1.address)
  if (isSchool) {
    console.log(`   ${retrievedName} registered successfully: ${school1.address}.\n`)
  } else {
    console.log(`   Restration failed.`)
  }
  console.log(`Done.\n`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
