import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'

import Tabs from './Tabs'

const logoColor = '#0f2a87'

// add 'disabled' to disable a link:
//     <LinkContainer to="/issue-diplomas" disabled>

const ViewDiplomas = () => {

  const account = useSelector(state => state.provider.account)

  return (
    <div>
      <Card className='mx-auto px-4' style={{ color: logoColor }}>
        <Card.Header>
          <Nav className="justify-content-center" variant="tabs" defaultActiveKey="/view-diplomas">
            <Tabs />
          </Nav>
        </Card.Header>

        <Card.Body>
          {account ? (
            <div>
              <Card.Title className="text-center my-3">View Diplomas Tab</Card.Title>
              <Card.Text>
                Here is where content goes...
              </Card.Text>
            </div>
          ) : (
            <Card.Title className="text-center my-3">Please connect wallet.</Card.Title>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default ViewDiplomas
