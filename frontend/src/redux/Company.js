import { createSlice } from '@reduxjs/toolkit'

export const companySlice = createSlice({
  name: 'company',
  initialState: {
    },
  reducers: {
    setCompany: (state, action) => {
      state = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCompany } = companySlice.actions

export default companySlice.reducer