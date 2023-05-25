/* Navigation.js
**
** Component to manage & display the logo, title, and navigation elements
** across the top of the page.
*******************************************************************************
*/
import { useSelector, useDispatch } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import {
  loadAccount,
  loadIsSchool,
  loadSchoolName,
  loadOwnedCreds
} from '../store/interactions'

import config from '../config.json'

import logo from '../SW3_logo_small.png'
const logoColor = '#0f2a87'

const Navigation = () => {
  const chainId = useSelector(state => state.provider.chainId)
  const account = useSelector(state => state.provider.account)
  const credentials = useSelector(state => state.credentials.contracts)
  const academicCreds = useSelector(state => state.academicCreds.contract)

  const dispatch = useDispatch()

  const connectHandler = async () => {
    // "Connect" button pressed ... load current account
    const account = await loadAccount(dispatch)

    // load the 'isSchool' indicator (true if registered school acct, else false)
    await loadIsSchool(academicCreds, account, dispatch)

    // load school name for the account (empty string if not a registered school)
    await loadSchoolName(academicCreds, account, dispatch)

    // load the credentials owned by the account (empty arrays if none owned)
    await loadOwnedCreds(credentials[0], account, dispatch)
    await loadOwnedCreds(credentials[1], account, dispatch)
  }

  const networkHandler = async (e) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: e.target.value }],
      })
    } catch (error) {
        alert(error.message)
    }
  }

  return (
    <Navbar className='my-3' expand="lg">
      <img
        alt="logo"
        src={logo}
        width="80"
        height="115"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#" style={{ color: logoColor }}>Academic Credentials Portal</Navbar.Brand>

      <Navbar.Toggle aria-controls="nav" />
      <Navbar.Collapse id="nav" className="justify-content-end">

        <div className="d-flex justify-content-end mt-3">

          <Form.Select
            aria-label="Network Selector"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={networkHandler}
            style={{ maxWidth: '200px', marginRight: '20px' }}
          >
            <option value="0" disabled>Select Network</option>
            <option value="0x7A69">Localhost</option>
            <option value="0xAA36A7">Sepolia</option>
            <option value="0x13881">Mumbai</option>
            <option value="0x5">Goerli</option>
          </Form.Select>

          {account ? (
            <Navbar.Text className='d-flex align-items-center' style={{ color: logoColor }}>
              {account.slice(0, 5) + '...' + account.slice(38, 42)}
            </Navbar.Text>
          ) : (
            <Button onClick={connectHandler}>Connect</Button>
          )}

        </div>

      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
