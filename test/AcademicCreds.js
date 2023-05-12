const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('AcademicCreds', () => {

  const BASE_URI = 'ipfs://'
  const NAME1 = 'Transcript'
  const SYMBOL1 = 'TSCRP'
  const NAME2 = 'Diploma'
  const SYMBOL2 = 'DPLMA'

  let deployer,
      school1, school2, school3,
      student1, student2, student3

  const school1Name = "Harvard University"
  const school2Name = "Montana State University"
  const school3Name = "Oral Roberts University"

  beforeEach(async () => {

    // fetch accounts
    let accounts = await ethers.getSigners()
    deployer = accounts[0]
    school1 = accounts[1]
    school2 = accounts[2]
    school3 = accounts[3]
    student1 = accounts[4]
    student2 = accounts[5]
    student3 = accounts[6]

    // deploy credential contracts
    const Credential = await ethers.getContractFactory('Credential')
    transcriptCred = await Credential.deploy(NAME1, SYMBOL1)
    diplomaCred = await Credential.deploy(NAME2, SYMBOL2)

    // deploy AcademicCreds contract
    const AcademicCreds = await ethers.getContractFactory('AcademicCreds')
    academicCreds = await AcademicCreds.deploy(transcriptCred.address, diplomaCred.address)

    // configure credential contracts with controller address
    transcriptCred.setAcademicCredsAddress(academicCreds.address)
    diplomaCred.setAcademicCredsAddress(academicCreds.address)

    // register school with controller contract
    transaction =
      await academicCreds.connect(deployer).registerSchool(
        school1.address, school1Name)
    result = await transaction.wait()
  })

  describe('Deployment', () => {

    it('has correct transcript token address', async () => {
      expect(await academicCreds.transcriptCred()).to.equal(transcriptCred.address)
    })

    it('has correct diploma token address', async () => {
      expect(await academicCreds.diplomaCred()).to.equal(diplomaCred.address)
    })

  })

  describe('Register Schools', () => {
    let transaction, result

    describe('Success', async () => {

      beforeEach(async () => {
        // register a 2nd school
        transaction = await academicCreds.connect(deployer).registerSchool(school2.address, school2Name)
        result = await transaction.wait()
      })

      it('adds new school to mapping', async () => {
        expect(await academicCreds.registeredSchools(school2.address)).to.equal(school2Name)
      })

      it('correctly identifies a registered school', async () => {
        expect(await academicCreds.isSchool(school2.address)).to.be.true
      })

      it('emits RegisterSchool event', async () => {
        await expect(transaction).to.emit(academicCreds, 'RegisterSchool')
          .withArgs(school2.address, school2Name)
      })

    })

    describe('Failure', async () => {

      it('prevents non-owner from registering a school', async () => {
        await expect(
          academicCreds.connect(student1).registerSchool(school1.address, school1Name)).to.be.reverted
      })

      it('prevents an empty school name', async () => {
        await expect(
          academicCreds.connect(deployer).registerSchool(school1.address, "")).to.be.reverted
      })

      it('correctly identifies an un-registered address', async () => {
        expect(await academicCreds.isSchool(school2.address)).to.be.false
      })

    })

  })

  describe('Issuing Credentials', () => {
    let transaction, result

    describe('Success', async () => {

      beforeEach(async () => {
        // register a 2nd school
        transaction = await academicCreds.connect(deployer).registerSchool(school2.address, school2Name)
        result = await transaction.wait()

        // issue a transcript to student1 via school1
        transaction =
          await academicCreds.connect(school1).issueCredential(
            student1.address, transcriptCred.address, BASE_URI);
        result = await transaction.wait()

        // issue a diploma to student2 via school2
        transaction =
          await academicCreds.connect(school2).issueCredential(
            student2.address, diplomaCred.address, BASE_URI);
        result = await transaction.wait()
      })

      it('issues transcript & diploma to the correct account', async () => {
        let tokenID = 0
        expect(await transcriptCred.ownerOf(tokenID)).to.equal(student1.address)
        expect(await diplomaCred.ownerOf(tokenID)).to.equal(student2.address)
      })

      it('returns the correct balance for accounts', async () => {
        expect(await transcriptCred.balanceOf(student1.address)).to.equal(1)
        expect(await diplomaCred.balanceOf(student2.address)).to.equal(1)
      })

      it('returns the correct URI', async () => {
        let tokenID = 0
        expect(await transcriptCred.tokenURI(tokenID)).to.equal(BASE_URI)
        expect(await diplomaCred.tokenURI(tokenID)).to.equal(BASE_URI)
      })

      it('emits IssueCredential event', async () => {
        await expect(transaction).to.emit(academicCreds, 'IssueCredential')
          .withArgs(NAME2, student2.address, BASE_URI)
      })

    })

    describe('Failure', async () => {

      it('prevents non-registered school from minting', async () => {
        // issue a transcript to student3 via unregistered school3
        await expect(academicCreds.connect(school3).issueCredential(
            student3.address, transcriptCred.address, BASE_URI)).to.be.reverted;
      })

    })
  })

})
