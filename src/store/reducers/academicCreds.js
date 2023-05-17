import { createSlice } from '@reduxjs/toolkit'

export const academicCreds = createSlice({
  name: 'academicCreds',
  initialState: {
    contract: null,
    isSchool: false,
    ownedTranscripts: [],
    ownedDiplomas: []
  },
  reducers: {
    setContract: (state, action) => {
      state.contract = action.payload
    },
    setIsSchool: (state, action) => {
      state.isSchool = action.payload
    },
    setOwnedTranscripts: (state, action) => {
      state.ownedTranscripts = action.payload
    },
    setOwnedDiplomas: (state, action) => {
      state.ownedDiplomas = action.payload
    }
  }
})

export const {
  setContract,
  setIsSchool,
  setOwnedTranscripts,
  setOwnedDiplomas
} = academicCreds.actions

export default academicCreds.reducer;
