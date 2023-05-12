import logo from '../logo.svg';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// components
//import Navigation from './Navigation'
//import Loading from './Loading'

import {
  loadProvider,
  loadNetwork,
  loadAccount
} from '../store/interactions'

function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // initiate provider
    const provider = await loadProvider(dispatch)

    // fetch chainId
    const chainId = await loadNetwork(provider, dispatch)

    // fetch accounts
    await loadAccount(dispatch)

  }

  useEffect(() => {
    loadBlockchainData()
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
