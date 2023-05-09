const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('AcademicCreds', () => {

  const BASE_URI = 'ipfs://'
  const TRANSCRIPT = 0
  const DIPLOMA = 1

  let nft,
      deployer,
      school1, school2, school3,
      student1, student2, student3, student4

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
    student4 = accounts[7]

    // deploy contract
    const AcademicCreds = await ethers.getContractFactory('AcademicCreds')
    academicCreds = await AcademicCreds.deploy(BASE_URI)

  })

  describe('Deployment', () => {

    it('has correct base URI', async () => {
      expect(await academicCreds.baseURI()).to.equal(BASE_URI)
    })

  })

  describe('Register Schools', () => {
    let transaction, result

    describe('Success', async () => {

      beforeEach(async () => {
        // register a school
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
        // register a school
        transaction = await academicCreds.connect(deployer).registerSchool(school2.address, school2Name)
        result = await transaction.wait()
      })

      it('adds student to registeredStudents mapping', async () => {
        // issue a transcript
        transaction =
          await academicCreds.connect(school2).issueCredential(student1.address, TRANSCRIPT, '0x');
        result = await transaction.wait()

        expect(await academicCreds.registeredStudents(student1.address)).to.equal(1)
      })

      it('mints transcript & diploma to account', async () => {
        // check balances before 
        expect(await academicCreds.balanceOf(student1.address, TRANSCRIPT)).to.equal(0)
        expect(await academicCreds.balanceOf(student1.address, DIPLOMA)).to.equal(0)

        // issue a transcript
        transaction =
          await academicCreds.connect(school2).issueCredential(student1.address, TRANSCRIPT, '0x');
        result = await transaction.wait()

        // check balances
        expect(await academicCreds.balanceOf(student1.address, TRANSCRIPT)).to.equal(1)
        expect(await academicCreds.balanceOf(student1.address, DIPLOMA)).to.equal(0)

        // issue a diploma
        transaction =
          await academicCreds.connect(school2).issueCredential(student1.address, DIPLOMA, '0x');
        result = await transaction.wait()

        // check balances
        expect(await academicCreds.balanceOf(student1.address, TRANSCRIPT)).to.equal(1)
        expect(await academicCreds.balanceOf(student1.address, DIPLOMA)).to.equal(1)
      })
    
    })

    describe('Failure', async () => {

      it('prevents non-registered school from minting', async () => {
        await expect(
          academicCreds.connect(school2).issueCredential(student2.address, TRANSCRIPT, '0x')).to.be.reverted
      })
    })
  })

  describe('Soulbound Properties', () => {
    let transaction, result

    beforeEach(async () => {
      // register a school
      transaction = await academicCreds.connect(deployer).registerSchool(school2.address, school2Name)
      result = await transaction.wait()
      // issue a transcript
      transaction =
        await academicCreds.connect(school2).issueCredential(student1.address, TRANSCRIPT, '0x');
      result = await transaction.wait()
    })

    it('does not allow approvals', async () => {
      // attempt to set approval for student 2
      await expect(
        academicCreds.connect(student1).setApprovalForAll(student2.address, true)).to.be.reverted
    })

    it('does not allow transfers', async () => {
      // attempt to transfer to student 2
      await expect(
        academicCreds.connect(student1).safeTransferFrom(
                  student1.address,
                  student2.address,
                  TRANSCRIPT, 1, '0x')).to.be.reverted
    })

  })
})
