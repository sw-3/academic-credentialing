/* credentials.js
**
** Defines initial state in Redux for data related to the 2 Credential.sol
** contracts, and the actions to dispatch to write the data to the store.
*******************************************************************************
*/
import { createSlice } from '@reduxjs/toolkit'

export const credentials = createSlice({
  name: 'credentials',
  initialState: {
    contracts: [],
    symbols: []
  },
  reducers: {
    setContracts: (state, action) => {
      state.contracts = action.payload
    },
    setSymbols: (state, action) => {
      state.symbols = action.payload
    }
  }
})

export const {
  setContracts,
  setSymbols
} = credentials.actions

export default credentials.reducer;
