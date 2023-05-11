const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Credential', () => {

  const BASE_URI = 'ipfs://'
  const NAME = 'Transcripts'
  const SYMBOL = 'TSCRP'

  let deployer,
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

    // deploy contracts
    const AcademicCreds = await ethers.getContractFactory('AcademicCreds')
    academicCreds = await AcademicCreds.deploy()    
    const Credential = await ethers.getContractFactory('Credential')
    credential = await Credential.deploy(NAME, SYMBOL, academicCreds.address)
  })

  describe('Deployment', () => {

    it('returns correct name', async () => {
      expect(await credential.name()).to.equal(NAME)
    })

    it('returns correct symbol', async () => {
      expect(await credential.symbol()).to.equal(SYMBOL)
    })

    // have to set academicCredsAddress in Transcript.sol as public to run this test!
    // it('returns the academicCreds contract address', async () => {
    //   expect(await credential.academicCredsAddress()).to.equal(academicCreds.address)
    // })

  })

  describe('Minting Credentials', () => {
    let transaction, result

    describe('Success', async () => {

      beforeEach(async () => {
        // mint a transcript to student1
        // SDW:  Have to do this via AcademicCreds.issueCredential
        transaction =
          await credential.connect(academicCreds).safeMint(student1.address, BASE_URI);
        result = await transaction.wait()
      })

      it('mints to the correct account', async () => {
        let tokenID = 0
        expect(await credential.ownerOf(tokenID)).to.equal(student1.address)

        // mint a transcript to student2
        transaction =
          await credential.connect(student1).safeMint(student2.address, BASE_URI);
        result = await transaction.wait()

        tokenID = 1
        expect(await credential.ownerOf(tokenID)).to.equal(student2.address)
      })

      it('returns the correct balance', async () => {
        // mint another transcript to student1
        transaction =
          await credential.connect(student1).safeMint(student1.address, BASE_URI);
        result = await transaction.wait()

        expect(await credential.balanceOf(student1.address)).to.equal(2)
      })

    })

    describe('Failure', async () => {

      it('prevents all but AcedemicCreds account from minting', async () => {
        // mint a transcript from AcademicCreds to student1
        transaction =
          await credential.connect(student1).safeMint(student1.address, BASE_URI);
        result = await transaction.wait()

        // check balance
        expect(await credential.balanceOf(student1.address)).to.equal(1)
      })

    })
  })

  describe('Burning Credentials', () => {
    let transaction, result

    describe('Success', async () => {

      beforeEach(async () => {
        // mint a transcript to student1
        transaction =
          await credential.connect(student1).safeMint(student1.address, BASE_URI)
        result = await transaction.wait()

        // mint another transcript to student1
        transaction =
          await credential.connect(student1).safeMint(student1.address, BASE_URI)
        result = await transaction.wait()
      })

      it('burns the token', async () => {
        // check token balance before
        expect(await credential.balanceOf(student1.address)).to.equal(2)

        // burn the first token issued
        let tokenID = 0
        transaction = await credential.connect(student1).burn(tokenID)
        result = await transaction.wait()

        // check token balance after
        expect(await credential.balanceOf(student1.address)).to.equal(1)

        // check the token owners - ownerOf should revert for the first
        await expect(credential.ownerOf(tokenID)).to.be.reverted
        tokenID = 1
        // ownerOf should still return the student for the 2nd
        expect(await credential.ownerOf(tokenID)).to.equal(student1.address)

      })

    })

    describe('Failure', async () => {

      it('prevents non- token owner from burning', async () => {
        // mint a transcript to student1
        transaction =
          await credential.connect(student1).safeMint(student1.address, BASE_URI)
        result = await transaction.wait()

        // different account requests to burn
        let tokenID = 0
        await expect(credential.connect(student2).burn(tokenID)).to.be.reverted

        // check balance is still 1
        expect(await credential.balanceOf(student1.address)).to.equal(1)
      })

    })
  })

  describe('Soulbound Properties', () => {
    let transaction, result
/*
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
*/
  })
})
