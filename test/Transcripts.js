const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Transcripts', () => {

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

    // deploy contract
    const Transcripts = await ethers.getContractFactory('Transcripts')
    transcripts = await Transcripts.deploy()

  })

  describe('Deployment', () => {

    it('returns correct name', async () => {
      expect(await transcripts.name()).to.equal(NAME)
    })

    it('returns correct symbol', async () => {
      expect(await transcripts.symbol()).to.equal(SYMBOL)
    })

  })

  describe('Minting Transcripts', () => {
    let transaction, result

    describe('Success', async () => {

      beforeEach(async () => {
        // mint a transcript to student1
        transaction =
          await transcripts.safeMint(student1.address, BASE_URI);
        result = await transaction.wait()
      })

      it('mints to the correct account', async () => {
        let tokenID = 0
        expect(await transcripts.ownerOf(tokenID)).to.equal(student1.address)

        // mint a transcript to student2
        transaction =
          await transcripts.safeMint(student2.address, BASE_URI);
        result = await transaction.wait()

        tokenID = 1
        expect(await transcripts.ownerOf(tokenID)).to.equal(student2.address)
      })

      it('returns the correct balance', async () => {
        // mint another transcript to student1
        transaction =
          await transcripts.safeMint(student1.address, BASE_URI);
        result = await transaction.wait()

        expect(await transcripts.balanceOf(student1.address)).to.equal(2)
      })

/*
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
*/    
    })

    describe('Failure', async () => {
/*
      it('prevents non-registered school from minting', async () => {
        await expect(
          academicCreds.connect(school2).issueCredential(student2.address, TRANSCRIPT, '0x')).to.be.reverted
      })
*/
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
