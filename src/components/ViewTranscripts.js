import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'

import Tabs from './Tabs'

import {
  loadOwnedTranscripts
} from '../store/interactions'

const logoColor = '#0f2a87'

const ViewTranscripts = () => {
  let ownedTranscripts, count
  const dispatch = useDispatch()
  const [address, setAddress] = useState("")
  const [isWaiting, setIsWaiting] = useState(false)

  // fetch data from Redux state
  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)
  const credentials = useSelector(state => state.credentials.contracts)
  const transcriptCred = credentials[0]
  ownedTranscripts = useSelector(state => state.academicCreds.ownedTranscripts)
  count = ownedTranscripts.length

  // function to handle an entered wallet address
  const addressHandler = async (e) => {
    e.preventDefault()

    try {
      if (address !== "")
      {
        // load the transcripts owned by the address entered
        await loadOwnedTranscripts(transcriptCred, address, dispatch)
      }
      else
      {
        setAddress(account)
      }
    } catch {
      window.alert('User rejected or transaction reverted')
    }
  }

  // function to handle a delete transcript button press
  const deleteHandler = async (_transcriptId) => {
    try {
      // get signer
      const signer = await provider.getSigner()

      // burn the transcript token to delete it
      const transaction = await transcriptCred.connect(signer).burn(_transcriptId)
      await transaction.wait()

      // reload the owned transcripts into Redux
      await loadOwnedTranscripts(transcriptCred, account, dispatch)

    } catch {
      window.alert('User rejected or transaction reverted')
    }
  }

  return (
    <div>
      <Card className='mx-auto px-4' style={{ color: logoColor }}>
        <Card.Header>
          <Nav className='justify-content-center' variant='tabs' defaultActiveKey='/'>
            <Tabs />
          </Nav>
        </Card.Header>

        <Card.Body>
          {account ? (
            (count > 0) ? (
              <div>
                <Card.Title className='text-center my-3'>
                  Transcripts Owned by: <div className='my-1'>{ownedTranscripts[0].recipient_account}</div>
                </Card.Title>

                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>Issue Date</th>
                      <th>Issuer</th>
                      <th>Issuer Acct</th>
                      <th>Recipient</th>
                      <th>Recipient Acct</th>
                      <th>School Year</th>
                      <th>Semester</th>
                      <th>PDF</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ownedTranscripts.map((transcript, index) => (
                      <>
                        <tr key={(index)}>
                          <td>{dayjs.unix(transcript.date).format('MM/DD/YYYY')}</td>
                          <td>{transcript.issuer}</td>
                          <td>{transcript.issuer_account.slice(0, 5) + '...' +
                                    transcript.issuer_account.slice(38, 42)}</td>
                          <td>{transcript.recipient}</td>
                          <td>{transcript.recipient_account.slice(0, 5) + '...' +
                                    transcript.recipient_account.slice(38, 42)}</td>
                          <td>{transcript.school_year}</td>
                          <td>{transcript.semester}</td>
                          <td><a href={transcript.credential_image} target='_blank'>PDF</a></td>
                          <td>
                            {(account === transcript.recipient_account) && (
                              <Button
                                variant='danger'
                                style={{ width: '100%' }}
                                onClick={() => deleteHandler(transcript.tokenId)}
                              >
                                Delete
                              </Button>
                            )}
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <Card.Title className='text-center my-3'>No Owned Transcripts</Card.Title>
            )
          ) : (
            <Card.Title className='text-center my-3'>Please connect wallet.</Card.Title>
          )}
        </Card.Body>

        {account ? (
          <>
            <hr />

            <h5 className='my-2 text-center'>Enter wallet address to view Transcripts:</h5>

            <Form onSubmit={addressHandler} style={{ maxWidth: '800px', margin: '10px auto' }}>
              <Form.Group as={Row}>
                <Col xs={7}>
                  <Form.Control type='address' placeholder='0x...' onChange={(e) => setAddress(e.target.value)}/>
                </Col>
                <Col className='text-center'>
                  {isWaiting ? (
                    <Spinner annimation='border' />
                  ): (
                    <Button variant='primary' type='submit' style={{ width: '100%' }}>
                      View Transcripts
                    </Button>
                  )}
                </Col>
              </Form.Group>
            </Form>
          </>
        ) : (
          <div> </div>
        )}

      </Card>
    </div>
  )
}

export default ViewTranscripts
