import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import { useSelector, useDispatch } from 'react-redux'

import Tabs from './Tabs'
import Alert from './Alert'

import {
  loadOwnedCreds,
  issueCred
} from '../store/interactions'

const logoColor = '#0f2a87'

const IssueTranscripts = () => {

  const dispatch = useDispatch()
  const [address, setAddress] = useState('')
  const [uri, setUri] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  // fetch data from Redux state
  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)
  const credentials = useSelector(state => state.credentials.contracts)
  const transcriptCred = credentials[0]
  const academicCreds = useSelector(state => state.academicCreds.contract)
  const isSchoolAccount = useSelector(state => state.academicCreds.isSchool)
  const isIssuing = useSelector(state => state.academicCreds.issuing.isIssuing)
  const isSuccess = useSelector(state => state.academicCreds.issuing.isSuccess)
  const transactionHash = useSelector(state => state.academicCreds.issuing.transactionHash)

  const issueTranscriptHandler = async (e) => {
    e.preventDefault()

    setShowAlert(false)

    if (address !== '' && uri !== '')
    {
      // issue transcript token to wallet address
      await issueCred(
        provider,
        academicCreds,
        address,
        transcriptCred.address,
        uri,
        dispatch)

      // reset the owned transcripts list in Redux
      await loadOwnedCreds(transcriptCred, account, dispatch)

      setShowAlert(true)

    } else {
      window.alert('Enter the metadata URI and a wallet address')
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
                  {isIssuing ? (
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

      {isIssuing ? (
        <Alert
          message={'Issuing Transcript...'}
          transactionHash={null}
          variant={'info'}
          setShowAlert={setShowAlert}
        />

      ) : isSuccess && showAlert ? (
        <Alert
          message={'Succes!'}
          transactionHash={transactionHash}
          variant={'success'}
          setShowAlert={setShowAlert}
        />

      ) : !isSuccess && showAlert ? (
        <Alert
          message={'Failed!'}
          transactionHash={null}
          variant={'danger'}
          setShowAlert={setShowAlert}
        />

      ) : (
        <></>
      )}

    </div>
  )
}

export default IssueTranscripts
