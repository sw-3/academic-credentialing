import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// components
import Navigation from './Navigation'
//import Loading from './Loading'

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadCredentials,
  loadAcademicCreds
} from '../store/interactions'

function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // initiate provider
    const provider = await loadProvider(dispatch)

    // fetch chainId
    const chainId = await loadNetwork(provider, dispatch)

    // reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // fetch current account from Metamask when changed
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(dispatch)
    })

    // initiate contracts
    await loadCredentials(provider, chainId, dispatch)
    await loadAcademicCreds(provider, chainId, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()
  }, []);

  return (
    <Container>
      <HashRouter>

        <Navigation />

        <hr />

        <p>
          Placeholder here...
        </p>

      </HashRouter>
    </Container>
  )
}

export default App;
