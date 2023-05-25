/* interactions.js
** 
** Functions that allow the front end to interact with the blockchain
*******************************************************************************
*/
import { ethers } from 'ethers'

import {
  setProvider,
  setNetwork,
  setAccount
} from './reducers/provider'

import {
  setContracts,
  setSymbols
} from './reducers/credentials'

import {
  setContract,
  setIsSchool,
  setSchoolName,
  setOwnedTranscripts,
  setOwnedDiplomas,
  issueRequest,
  issueSuccess,
  issueFail,
  deleteRequest,
  deleteSuccess,
  deleteFail
} from './reducers/academicCreds'

import CREDENTIAL_ABI from '../abis/Credential.json'
import ACADEMIC_CREDS_ABI from '../abis/AcademicCreds.json'
import config from '../config.json'

// ----------------------------------------------------------------------------
// Load Connection information
// ----------------------------------------------------------------------------
export const loadProvider = (dispatch) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  dispatch(setProvider(provider))

  return provider
}

export const loadNetwork = async (provider, dispatch) => {
  const { chainId } = await provider.getNetwork()
  dispatch(setNetwork(chainId))

  return chainId
}

export const loadAccount = async (dispatch) => {
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  const account = ethers.utils.getAddress(accounts[0])
  dispatch(setAccount(account))

  return account
}

// ----------------------------------------------------------------------------
// Load Contracts
// ----------------------------------------------------------------------------
export const loadCredentials = async (provider, chainId, dispatch) => {
  const transcriptCred = new ethers.Contract
                        (
                          config[chainId].transcriptCred.address,
                          CREDENTIAL_ABI,
                          provider
                        )
  const diplomaCred = new ethers.Contract
                        (
                          config[chainId].diplomaCred.address,
                          CREDENTIAL_ABI,
                          provider
                        )

  dispatch(setContracts([transcriptCred, diplomaCred]))
  dispatch(setSymbols([await transcriptCred.symbol(), await diplomaCred.symbol()]))

  return [transcriptCred, diplomaCred]
}

export const loadAcademicCreds = async (provider, chainId, dispatch) => {
  const academicCreds = new ethers.Contract
                        (
                          config[chainId].academicCreds.address,
                          ACADEMIC_CREDS_ABI,
                          provider
                        )
  dispatch(setContract(academicCreds))

  return academicCreds
}

// ----------------------------------------------------------------------------
// Load Registered School Indicator and School Name
// ----------------------------------------------------------------------------
export const loadIsSchool = async (academicCreds, account, dispatch) => {
  const isSchool = await academicCreds.isSchool(account)
  dispatch(setIsSchool(isSchool))
}

export const loadSchoolName = async (academicCreds, account, dispatch) => {
  const schoolName = await academicCreds.registeredSchools(account)
  dispatch(setSchoolName(schoolName))
}

// ----------------------------------------------------------------------------
// Load the json for credentials owned by account
// ----------------------------------------------------------------------------
export const loadOwnedCreds = async (credential, account, dispatch) => {
  const symbol = await credential.symbol()
  const ownedTokenIds = await credential.walletOfOwner(account)
  const count = ownedTokenIds.length
  const ownedCredentials = []

  for (var i=0; i < count; i++) {
    const tokenID = ownedTokenIds[i]
    const uri = await credential.tokenURI(tokenID)

    const response = await fetch(uri)
    if(!response.ok)
      throw new Error(response.statusText)

    let json = await response.json()
    json.tokenId = Number(tokenID)
    ownedCredentials.push(json)
  }

  if (symbol === 'TSCRP') {
    dispatch(setOwnedTranscripts(ownedCredentials))
  }
  else if (symbol === 'DPLMA') {
    dispatch(setOwnedDiplomas(ownedCredentials))
  }
}

// ----------------------------------------------------------------------------
// Issue a credential on the blockchain
// ----------------------------------------------------------------------------
export const issueCred =
    async (provider, academicCreds, toAddress, credAddress, uri, dispatch) => {

  try {
    dispatch(issueRequest())

    let transaction

    const signer = await provider.getSigner()

    transaction = await academicCreds.connect(signer).issueCredential(
      toAddress, credAddress, uri)

    await transaction.wait()

    dispatch(issueSuccess(transaction.hash))

  } catch (error) {
    dispatch(issueFail())
  }
}

// ----------------------------------------------------------------------------
// Delete a credential from the blockchain
// ----------------------------------------------------------------------------
export const deleteCred = async (provider, credential, credId, dispatch) => {

  try {
    dispatch(deleteRequest())

    let transaction

    const signer = await provider.getSigner()

    // burn the token to delete it
    transaction = await credential.connect(signer).burn(credId)
    await transaction.wait()

    dispatch(deleteSuccess(transaction.hash))

  } catch (error) {
    dispatch(deleteFail())
  }
}
