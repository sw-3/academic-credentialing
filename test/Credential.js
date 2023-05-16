const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Credential', () => {

  const BASE_URI = 'ipfs://'
  const NAME1 = 'Transcript'
  const SYMBOL1 = 'TSCRP'
  const NAME2 = 'Diploma'
  const SYMBOL2 = 'DPLMA'
  const URI1 =
    "file://localhost//home/scottdev/devel/dappu/academic-credentials/example_metadata/tscrp_00001.json";
  const URI2 =
    "file://localhost//home/scottdev/devel/dappu/academic-credentials/example_metadata/tscrp_00002.json";

  let deployer, school1, student1, student2

  const school1Name = "Harvard University"

  beforeEach(async () => {

    // fetch accounts
    let accounts = await ethers.getSigners()
    deployer = accounts[0]
    school1 = accounts[1]
    student1 = accounts[2]
    student2 = accounts[3]

    // deploy credential contracts
    const Credential = await ethers.getContractFactory('Credential')
    transcriptCred = await Credential.deploy(NAME1, SYMBOL1)
    diplomaCred = await Credential.deploy(NAME2, SYMBOL2)

    // deploy controller contract
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

    it('returns correct name', async () => {
      expect(await transcriptCred.name()).to.equal(NAME1)
    })

    it('returns correct symbol', async () => {
      expect(await diplomaCred.symbol()).to.equal(SYMBOL2)
    })

    it('returns the academicCreds contract address', async () => {
      expect(await diplomaCred.academicCredsAddress()).to.equal(academicCreds.address)
    })

  })

  describe('Minting Credentials', () => {
    let transaction, result

    describe('Success', async () => {

      beforeEach(async () => {

        // issue a transcript to student1 via school1
        transaction =
          await academicCreds.connect(school1).issueCredential(
            student1.address, transcriptCred.address, URI1);
        result = await transaction.wait()
      })

      it('mints to the correct account', async () => {
        let tokenID = 0
        expect(await transcriptCred.ownerOf(tokenID)).to.equal(student1.address)
      })

      it('returns the correct balance', async () => {
        expect(await transcriptCred.balanceOf(student1.address)).to.equal(1)
      })

      it('returns owner tokens and token URIs', async () => {
        // issue a 2nd Transcript
        transaction =
          await academicCreds.connect(school1).issueCredential(
            student1.address, transcriptCred.address, URI2);
        result = await transaction.wait()

        let tokenIds = await transcriptCred.walletOfOwner(student1.address)
        expect(await transcriptCred.tokenURI(tokenIds[0])).to.equal(URI1)
        expect(await transcriptCred.tokenURI(tokenIds[1])).to.equal(URI2)
      })
    })

    describe('Failure', async () => {

      it('prevents all but AcedemicCreds account from minting', async () => {

        // attempt to mint directly from a student account; should fail
        await expect(
          transcriptCred.connect(student1).safeMint(student1.address, BASE_URI)).to.be.reverted;

        // attempt to mint directly from the deployer; should fail
        await expect(
          transcriptCred.safeMint(student1.address, BASE_URI)).to.be.reverted;
      })

    })
  })

  describe('Burning Credentials', () => {
    let transaction, result

    beforeEach(async () => {
      // issue a transcript to student1 via school1
      transaction =
        await academicCreds.connect(school1).issueCredential(
          student1.address, transcriptCred.address, BASE_URI);
      result = await transaction.wait()
    })

    describe('Success', async () => {

      beforeEach(async () => {
        // issue another transcript to student1
        transaction =
          await academicCreds.connect(school1).issueCredential(
            student1.address, transcriptCred.address, BASE_URI);
        result = await transaction.wait()
      })

      it('burns the token', async () => {
        // check token balance before
        expect(await transcriptCred.balanceOf(student1.address)).to.equal(2)

        // burn the first token issued
        let tokenID = 0
        transaction = await transcriptCred.connect(student1).burn(tokenID)
        result = await transaction.wait()

        // check token balance after
        expect(await transcriptCred.balanceOf(student1.address)).to.equal(1)

        // check the token owners - ownerOf should revert for the first
        await expect(transcriptCred.ownerOf(tokenID)).to.be.reverted
        tokenID = 1
        // ownerOf should still return the student for the 2nd
        expect(await transcriptCred.ownerOf(tokenID)).to.equal(student1.address)

      })

    })

    describe('Failure', async () => {

      it('prevents non- token owner from burning', async () => {
        // different accounts request to burn
        let tokenID = 0
        await expect(transcriptCred.connect(student2).burn(tokenID)).to.be.reverted
        await expect(transcriptCred.burn(tokenID)).to.be.reverted

        // check balance is still 1
        expect(await transcriptCred.balanceOf(student1.address)).to.equal(1)
      })

    })
  })

  describe('Soulbound Properties', () => {
    let transaction, result

    beforeEach(async () => {
      // issue a transcript to student1 via school1
      transaction =
        await academicCreds.connect(school1).issueCredential(
          student1.address, transcriptCred.address, BASE_URI);
      result = await transaction.wait()
    })

    it('does not allow approvals', async () => {
      let tokenID = 0

      // attempt to set approval for student 2
      await expect(
        transcriptCred.connect(student1).approve(student2.address, tokenID)).to.be.reverted
      await expect(
        transcriptCred.connect(student1).setApprovalForAll(student2.address, true)).to.be.reverted
    })

    it('does not allow transfers', async () => {
      let tokenID = 0

      // attempt to transfer to student 2
      await expect(
        transcriptCred.connect(student1)['safeTransferFrom(address,address,uint256,bytes)'](
                  student1.address,
                  student2.address,
                  tokenID, '0x')).to.be.reverted

      await expect(
        transcriptCred.connect(student1)['safeTransferFrom(address,address,uint256)'](
                  student1.address,
                  student2.address,
                  tokenID)).to.be.reverted

      await expect(
        transcriptCred.connect(student1).transferFrom(
                    student1.address,
                    student2.address,
                    tokenID)).to.be.reverted

      // owner should still equal student1
      expect(await transcriptCred.ownerOf(tokenID)).to.equal(student1.address)

    })
  })
})
