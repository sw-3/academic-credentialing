import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Table from 'react-bootstrap/Table'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

import Tabs from './Tabs'

const logoColor = '#0f2a87'

const ViewTranscripts = () => {

  const account = useSelector(state => state.provider.account)
  const ownedTranscripts =
    useSelector(state => state.academicCreds.ownedTranscripts)

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
            <div>
              <Card.Title className="text-center my-3">Owned Transcripts</Card.Title>
              <Card.Text> </Card.Text>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Issue Date</th>
                    <th>Issuer</th>
                    <th>Issuer Account</th>
                    <th>Recipient</th>
                    <th>Recipient Account</th>
                    <th>School Year</th>
                    <th>Semester</th>
                    <th>PDF</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {ownedTranscripts.map((transcript, index) => (
                    <>
                      <tr key={(index)}>
                        <td>...</td>
                        <td>{transcript.issuer}</td>
                        <td>{transcript.issuer_account}</td>
                        <td>{transcript.recipient}</td>
                        <td>{transcript.recipient_account}</td>
                        <td>...</td>
                        <td>...</td>
                        <td>...</td>
                        <td>...</td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <Card.Title className="text-center my-3">Please connect wallet.</Card.Title>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default ViewTranscripts
