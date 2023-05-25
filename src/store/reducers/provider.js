/* provider.js
**
** Defines initial state in Redux for data related to the blockchain connection,
** and the actions to dispatch to write the data to the store.
*******************************************************************************
*/
import { createSlice } from '@reduxjs/toolkit'

export const provider = createSlice({
  name: 'provider',
  initialState: {
    connection: null,
    chainId: null,
    account: null
  },
  reducers: {
    setProvider: (state, action) => {
      state.connection = action.payload
    },
    setNetwork: (state, action) => {
      state.chainId = action.payload
    },
    setAccount: (state, action) => {
      state.account = action.payload
    }
  }
})

export const {
  setProvider,
  setNetwork,
  setAccount
} = provider.actions

export default provider.reducer;
