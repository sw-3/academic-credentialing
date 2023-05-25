/* deploy.js
**
** Academic Credentials deployment script
**
** Deployment must follow this order:
**
**    1) Deploy the Credential contracts first
**    2) Deploy the AcademicCreds contract
**    3) Set the AcademicCreds deployed address in each Credential contract
**
** The above steps will ensure that only the AcademicCreds contract can "mint" new
** credentials via the other contracts.
**
** You can run the script with `npx hardhat run --network localhost deploy.js`.
** Hardhat will compile your contracts, add the HRE members to the global scope,
** and execute the script.
*/
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

  // set academicCreds address in each credential contract
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

// Recommended pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
