import { useSelector, useDispatch } from 'react-redux'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap"

const Tabs = () => {

  const isSchoolAccount = useSelector(state => state.academicCreds.isSchool)

  return (
    <>
      <LinkContainer to="/">
        <Nav.Link>View Transcripts</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/view-diplomas">
        <Nav.Link>View Diplomas</Nav.Link>
      </LinkContainer>
      {isSchoolAccount ? (
        <LinkContainer to="/issue-transcripts">
          <Nav.Link>Issue Transcripts</Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer to="/issue-transcripts" disabled>
          <Nav.Link>Issue Transcripts</Nav.Link>
        </LinkContainer>
      )}
      {isSchoolAccount ? (
        <LinkContainer to="/issue-diplomas">
          <Nav.Link>Issue Diplomas</Nav.Link>
        </LinkContainer>
      ) : (
        <LinkContainer to="/issue-diplomas" disabled>
          <Nav.Link>Issue Diplomas</Nav.Link>
        </LinkContainer>
      )}
    </>
  )
}

export default Tabs
