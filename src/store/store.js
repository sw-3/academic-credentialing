/* store.js
**
** Configures the Redux store with the reducers.
*******************************************************************************
*/
import { configureStore } from '@reduxjs/toolkit'

import provider from './reducers/provider'
import credentials from './reducers/credentials'
import academicCreds from './reducers/academicCreds'

export const store = configureStore({
  reducer: {
    provider,
    credentials,
    academicCreds
  },
  middleware: getDefaultMiddleware => 
    getDefaultMiddleware({
      serializableCheck: false
    })
})
