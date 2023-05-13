import { createSlice } from '@reduxjs/toolkit'

export const academicCreds = createSlice({
  name: 'academicCreds',
  initialState: {
    contract: null
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    }
  }
})

export const {
  setContract
} = academicCreds.actions

export default academicCreds.reducer;
