/* academicCreds.js
**
** Defines initial state in Redux for data related to the AcademicCreds
** contract, and the actions to dispatch to write the data to the store.
*******************************************************************************
*/
import { createSlice } from '@reduxjs/toolkit'

export const academicCreds = createSlice({
  name: 'academicCreds',
  initialState: {
    contract: null,
    isSchool: false,
    schoolName: '',
    ownedTranscripts: [],
    ownedDiplomas: [],
    issuing: {
      isIssuing: false,
      isSuccess: false,
      transactionHash: null
    },
    deleting: {
      isDeleting: false,
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
    setSchoolName: (state, action) => {
      state.schoolName = action.payload
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
    },
    deleteRequest: (state, action) => {
      state.deleting.isDeleting = true
      state.deleting.isSuccess = false
      state.deleting.transactionHash = null
    },
    deleteSuccess: (state, action) => {
      state.deleting.isDeleting = false
      state.deleting.isSuccess = true
      state.deleting.transactionHash = action.payload
    },
    deleteFail: (state, action) => {
      state.deleting.isDeleting = false
      state.deleting.isSuccess = false
      state.deleting.transactionHash = null
    }
  }
})

export const {
  setContract,
  setIsSchool,
  setSchoolName,
  setOwnedTranscripts,
  setOwnedDiplomas,
  issueRequest,
  issueSuccess,
  issueFail,
  deleteRequest,
  deleteSuccess,
  deleteFail
} = academicCreds.actions

export default academicCreds.reducer;
