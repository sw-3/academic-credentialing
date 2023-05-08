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
    minter = accounts[1]
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
})
