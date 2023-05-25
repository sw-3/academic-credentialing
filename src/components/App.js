/* App.js
**
** Main application component.
** Loads blockchain data with every page refresh, and displays the other
** page components.
*******************************************************************************
*/
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

// components
import Navigation from './Navigation'
import ViewTranscripts from './ViewTranscripts'
import ViewDiplomas from './ViewDiplomas'
import IssueTranscripts from './IssueTranscripts'
import IssueDiplomas from './IssueDiplomas'

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadCredentials,
  loadAcademicCreds,
  loadIsSchool,
  loadSchoolName,
  loadOwnedCreds
} from '../store/interactions'

function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    let account, academicCreds, credentials
    let transcriptCred, diplomaCred

    // initiate provider
    const provider = await loadProvider(dispatch)

    // fetch chainId
    const chainId = await loadNetwork(provider, dispatch)

    // reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // initiate contracts
    credentials = await loadCredentials(provider, chainId, dispatch)
    transcriptCred = credentials[0]
    diplomaCred = credentials[1]
    academicCreds = await loadAcademicCreds(provider, chainId, dispatch)

    // fetch current account from Metamask when changed
    window.ethereum.on('accountsChanged', async () => {

      account = await loadAccount(dispatch)

      // load the School indicator and Name for the account
      await loadIsSchool(academicCreds, account, dispatch)
      await loadSchoolName(academicCreds, account, dispatch)

      // load the transcripts owned by the account
      await loadOwnedCreds(transcriptCred, account, dispatch)

      // load the diplomas owned by the account
      await loadOwnedCreds(diplomaCred, account, dispatch)
    })

  }

  useEffect(() => {
    loadBlockchainData()
  });

  return (
    <Container>
      <HashRouter>

        <Navigation />

        <hr />

        <Routes>
          <Route exact path="/" element={<ViewTranscripts />} />
          <Route path="/view-diplomas" element={<ViewDiplomas />} />
          <Route path="/issue-transcripts" element={<IssueTranscripts />} />
          <Route path="/issue-diplomas" element={<IssueDiplomas />} />
        </Routes>

      </HashRouter>
    </Container>
  )
}

export default App;
