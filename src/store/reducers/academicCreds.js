import { createSlice } from '@reduxjs/toolkit'

export const academicCreds = createSlice({
  name: 'academicCreds',
  initialState: {
    contract: null,
    isSchool: false,
    ownedTranscripts: [],
    ownedDiplomas: [],
    issuing: {
      isIssuing: false,
      isSuccess: false,
      transactionHash: null
    }
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
    },
    issueRequest: (state, action) => {
      state.issuing.isIssuing = true
      state.issuing.isSuccess = false
      state.issuing.transactionHash = null
    },
    issueSuccess: (state, action) => {
      state.issuing.isIssuing = false
      state.issuing.isSuccess = true
      state.issuing.transactionHash = action.payload
    },
    issueFail: (state, action) => {
      state.issuing.isIssuing = false
      state.issuing.isSuccess = false
      state.issuing.transactionHash = null
    }
  }
})

export const {
  setContract,
  setIsSchool,
  setOwnedTranscripts,
  setOwnedDiplomas,
  issueRequest,
  issueSuccess,
  issueFail
} = academicCreds.actions

export default academicCreds.reducer;
