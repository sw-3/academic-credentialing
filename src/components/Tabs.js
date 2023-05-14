import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap"

const Tabs = () => {
  return (
    <Nav variant="pills" defaultActiveKey="/" className='justify-content-center my-4'>
      <LinkContainer to="/">
        <Nav.Link>View Transcripts</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/view-diplomas">
        <Nav.Link>View Diplomas</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/issue-transcripts">
        <Nav.Link>Issue Transcripts</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/issue-diplomas">
        <Nav.Link>Issue Diplomas</Nav.Link>
      </LinkContainer>
    </Nav>
  )
}

export default Tabs
