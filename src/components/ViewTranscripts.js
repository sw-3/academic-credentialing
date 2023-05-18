import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs'

import Tabs from './Tabs'

const logoColor = '#0f2a87'

const ViewTranscripts = () => {
  let connectedOwner

  const account = useSelector(state => state.provider.account)
  const ownedTranscripts = useSelector(state => state.academicCreds.ownedTranscripts)
  const count = ownedTranscripts.length

  connectedOwner = false
  if (count > 0 && account == ownedTranscripts[0].recipient_account) {
    connectedOwner = true
  }

  function deleteHandler(_transcriptId) {
    console.log(_transcriptId)
  }

  return (
    <div>
      <Card className='mx-auto px-4' style={{ color: logoColor }}>
        <Card.Header>
          <Nav className="justify-content-center" variant="tabs" defaultActiveKey="/" style={{ color: logoColor }}>
            <Tabs />
          </Nav>
        </Card.Header>

        <Card.Body>
          {account ? (
            (count > 0) ? (
              <div>
                <Card.Title className="text-center my-3">Owned Transcripts</Card.Title>

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
                            {(account == transcript.recipient_account) && (
                              <Button
                                variant='danger'
                                style={{ width: '100%' }}
                                onClick={() => deleteHandler(index)}
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
              <Card.Title className="text-center my-3">There Are No Owned Transcripts</Card.Title>
            )
          ) : (
            <Card.Title className="text-center my-3">Please connect wallet.</Card.Title>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default ViewTranscripts
