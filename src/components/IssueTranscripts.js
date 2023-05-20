import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

import Tabs from './Tabs'

import {
  loadProvider,
  loadNetwork,
  loadCredentials,
  loadOwnedTranscripts,
  loadAcademicCreds
} from '../store/interactions'

const logoColor = '#0f2a87'

const IssueTranscripts = () => {

  const dispatch = useDispatch()
  const [address, setAddress] = useState('')
  const [uri, setUri] = useState('')
  const [isWaiting, setIsWaiting] = useState(false)

  const account = useSelector(state => state.provider.account)
  const isSchoolAccount = useSelector(state => state.academicCreds.isSchool)

  const issueTranscriptHandler = async (e) => {
    try {
      if (address !== '' && uri !== '')
      {
        // get signer and contract
        const provider = await loadProvider(dispatch)
        const signer = await provider.getSigner()
        const chainId = await loadNetwork(provider, dispatch)
        const credentials = await loadCredentials(provider, chainId, dispatch)
        const transcriptCred = credentials[0]
        const academicCreds = await loadAcademicCreds(provider, chainId, dispatch)

        // issue transcript token to wallet address
        const transaction = await academicCreds.connect(signer).issueCredential(
                      address, transcriptCred.address, uri)
        await transaction.wait()

        // reload the owned transcripts into Redux
        await loadOwnedTranscripts(transcriptCred, account, dispatch)
      }
    } catch {
      window.alert('User rejected or transaction reverted')
    }
  }

  return (
    <div>
      <Card className='mx-auto px-4' style={{ color: logoColor }}>
        <Card.Header>
          <Nav className='justify-content-center' variant='tabs' defaultActiveKey='/issue-transcripts'>
            <Tabs />
          </Nav>
        </Card.Header>

        <Card.Body>
          {account ? (
            isSchoolAccount ? (
              <Form onSubmit={issueTranscriptHandler} style={{ maxWidth: '450px', margin: '30px auto'}}>
                <Row className='my-2'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Enter URI location of Transcript metadata:</Form.Label>
                  </div>
                  <Form.Control
                    type='string'
                    placeholder='https://...'
                    onChange={(e) => setUri(e.target.value)}
                  />
                </Row>

                <Row className='my-4'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Enter wallet address to send Transcript:</Form.Label>
                  </div>
                  <Form.Control
                    type='address'
                    placeholder='0x...'
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Row>

                <Row className='my-5'>
                  {isWaiting ? (
                    <Spinner animation='border' style={{ display: 'block', margin: '0 auto' }} />
                  ) : (
                    <Button type='submit' style={{ maxWidth: '250px', margin: '0 auto' }}>
                      <strong>Issue Transcript</strong>
                    </Button>
                  )}
                </Row>

              </Form>
            ) : (
              <div>
                <Card.Title className='text-center my-3'>Only registered accounts can issue transcripts.</Card.Title>
                <Card.Text className='text-center my-3'> </Card.Text>
              </div>
            )
          ) : (
            <Card.Title className='text-center my-3'>Please connect wallet.</Card.Title>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default IssueTranscripts
