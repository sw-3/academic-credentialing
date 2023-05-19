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
  setOwnedTranscripts,
  setOwnedDiplomas
} from './reducers/academicCreds'

import CREDENTIAL_ABI from '../abis/Credential.json'
import ACADEMIC_CREDS_ABI from '../abis/AcademicCreds.json'
import config from '../config.json'

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
// Load Registered School Indicator
// ----------------------------------------------------------------------------
export const loadIsSchool = async (academicCreds, account, dispatch) => {
  const isSchool = await academicCreds.isSchool(account)
  dispatch(setIsSchool(isSchool))
}

// ----------------------------------------------------------------------------
// Load the json for credentials owned by account
// ----------------------------------------------------------------------------
export const loadOwnedTranscripts = async (transcriptCred, account, dispatch) => {
  const ownedTokenIds = await transcriptCred.walletOfOwner(account)
  const count = ownedTokenIds.length
  const ownedTranscripts = []

  for (var i=0; i < count; i++) {
    const tokenID = ownedTokenIds[i]
    const uri = await transcriptCred.tokenURI(tokenID)

    const response = await fetch(uri)
    if(!response.ok)
      throw new Error(response.statusText)

    const json = await response.json()
    ownedTranscripts.push(json)
  }
  dispatch(setOwnedTranscripts(ownedTranscripts))
}

export const loadOwnedDiplomas = async (diplomaCred, account, dispatch) => {
  const ownedTokenIds = await diplomaCred.walletOfOwner(account)
  const count = ownedTokenIds.length
  const ownedDiplomas = []

  for (var i=0; i < count; i++) {
    const tokenID = ownedTokenIds[i]
    const uri = await diplomaCred.tokenURI(tokenID)

    const response = await fetch(uri)
    if(!response.ok)
      throw new Error(response.statusText)

    const json = await response.json()
    ownedDiplomas.push(json)
  }
  dispatch(setOwnedDiplomas(ownedDiplomas))
}
