import { createSlice } from '@reduxjs/toolkit'

export const academicCreds = createSlice({
  name: 'academicCreds',
  initialState: {
    contract: null,
    isSchool: false
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },
    setIsSchool: (state, action) => {
      state.isSchool = action.payload
    }
  }
})

export const {
  setContract,
  setIsSchool
} = academicCreds.actions

export default academicCreds.reducer;
