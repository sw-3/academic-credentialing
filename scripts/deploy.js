// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  console.log('\n\n\nDeploying Academic Credentials contracts...\n')
  // get contracts
  const Credential = await hre.ethers.getContractFactory('Credential')
  const AcademicCreds = await hre.ethers.getContractFactory('AcademicCreds')

  // deploy credential contracts
  const transcriptCred = await Credential.deploy('Transcript', 'TSCRP')
  await transcriptCred.deployed()
  console.log(`Transcript NFT deployed to:   ${transcriptCred.address}\n`)

  const diplomaCred = await Credential.deploy('Diploma', 'DPLMA')
  await diplomaCred.deployed()
  console.log(`Diploma NFT deployed to:      ${diplomaCred.address}\n`)

  // deploy AcademicCreds
  const academicCreds = await AcademicCreds.deploy(transcriptCred.address, diplomaCred.address)
  await academicCreds.deployed()
  console.log(`Acedemic Creds deployed to:   ${academicCreds.address}\n`)

  // configure credential contracts with academicCreds address
  console.log('\n-----\n')
  console.log('Configuring credentials contracts...\n')
  let transaction
  transaction = await transcriptCred.setAcademicCredsAddress(academicCreds.address)
  await transaction.wait()
  console.log(`Transcript acedemicCreds addr set:  ${await transcriptCred.academicCredsAddress()}\n`)

  transaction = await diplomaCred.setAcademicCredsAddress(academicCreds.address)
  await transaction.wait()
  console.log(`Diploma acedemicCreds addr set:     ${await diplomaCred.academicCredsAddress()}\n`)
  console.log('Done.\n')
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
