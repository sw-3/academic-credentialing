import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import { useSelector, useDispatch } from 'react-redux'

import Tabs from './Tabs'

import {
  loadOwnedDiplomas
} from '../store/interactions'

const logoColor = '#0f2a87'

const IssueDiplomas = () => {

  const dispatch = useDispatch()
  const [address, setAddress] = useState('')
  const [uri, setUri] = useState('')
  const [isWaiting, setIsWaiting] = useState(false)

  // fetch data from Redux state
  const provider = useSelector(state => state.provider.connection)
  const account = useSelector(state => state.provider.account)
  const credentials = useSelector(state => state.credentials.contracts)
  const diplomaCred = credentials[1]
  const academicCreds = useSelector(state => state.academicCreds.contract)
  const isSchoolAccount = useSelector(state => state.academicCreds.isSchool)

  const issueDiplomaHandler = async (e) => {
    e.preventDefault()

    try {
      if (address !== '' && uri !== '')
      {
        // get signer
        const signer = await provider.getSigner()

        // issue diploma token to wallet address
        const transaction = await academicCreds.connect(signer).issueCredential(
                      address, diplomaCred.address, uri)
        await transaction.wait()

        // reset the owned diplomas list in Redux
        await loadOwnedDiplomas(diplomaCred, account, dispatch)
      }
    } catch {
      window.alert('User rejected or transaction reverted')
    }
  }

  return (
    <div>
      <Card className='mx-auto px-4' style={{ color: logoColor }}>
        <Card.Header>
          <Nav className='justify-content-center' variant='tabs' defaultActiveKey='/issue-diplomas'>
            <Tabs />
          </Nav>
        </Card.Header>

        <Card.Body>
          {account ? (
            isSchoolAccount ? (
              <Form onSubmit={issueDiplomaHandler} style={{ maxWidth: '450px', margin: '30px auto'}}>
                <Row className='my-2'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Enter URI location of Diploma metadata:</Form.Label>
                  </div>
                  <Form.Control
                    type='string'
                    placeholder='https://...'
                    onChange={(e) => setUri(e.target.value)}
                  />
                </Row>

                <Row className='my-4'>
                  <div className='d-flex justify-content-between'>
                    <Form.Label>Enter wallet address to send Diploma:</Form.Label>
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
                      <strong>Issue Diploma</strong>
                    </Button>
                  )}
                </Row>

              </Form>
            ) : (
              <div>
                <Card.Title className='text-center my-3'>Only registered accounts can issue diplomas.</Card.Title>
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

export default IssueDiplomas
