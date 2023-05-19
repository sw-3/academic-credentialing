import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

import Tabs from './Tabs'

const logoColor = '#0f2a87'

const IssueTranscripts = () => {

  const account = useSelector(state => state.provider.account)
  const isSchoolAccount = useSelector(state => state.academicCreds.isSchool)

  return (
    <div>
      <Card className='mx-auto px-4' style={{ color: logoColor }}>
        <Card.Header>
          <Nav className="justify-content-center" variant="tabs" defaultActiveKey="/issue-transcripts">
            <Tabs />
          </Nav>
        </Card.Header>

        <Card.Body>
          {account ? (
            isSchoolAccount ? (
              <div>
                <Card.Title className="text-center my-3">Issue Transcripts Tab</Card.Title>
                <Card.Text>
                  Here is where content goes...
                </Card.Text>
              </div>
            ) : (
              <div>
                <Card.Title className="text-center my-3">Only registered accounts can issue transcripts.</Card.Title>
                <Card.Text className="text-center my-3"> </Card.Text>
              </div>
            )
          ) : (
            <Card.Title className="text-center my-3">Please connect wallet.</Card.Title>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default IssueTranscripts
