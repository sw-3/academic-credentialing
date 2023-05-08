const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('AcademicCreds', () => {

  const BASE_URI = 'ipfs://'

  let nft,
      deployer,
      minter

  beforeEach(async () => {
    let accounts = await ethers.getSigners()
    deployer = accounts[0]
    school1 = accounts[1]
    school2 = accounts[2]
    school3 = accounts[3]
    student1 = accounts[4]
    student2 = accounts[5]
    student3 = accounts[6]
    student4 = accounts[7]
  })

  describe('Deployment', () => {

    beforeEach(async () => {
      const AcademicCreds = await ethers.getContractFactory('AcademicCreds')
      academicCreds = await AcademicCreds.deploy(BASE_URI)
    })

    it('has correct base URI', async () => {
      expect(await academicCreds.baseURI()).to.equal(BASE_URI)
    })

  })

  describe('Register Schools', () => {
    // only owner can register
    // correct ID returned for new
    // correct ID for existing

  })

  describe('Minting Credentials', () => {
    // only registered school can mint
    // student added to registered students
    // transcript token owned by student
    
  })


})
