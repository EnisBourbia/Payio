import { createSlice } from '@reduxjs/toolkit'

export const customerSlice = createSlice({
  name: 'customer',
  initialState: {
   clients: []   
  },
  reducers: {
    setCustomer: (state, action) => {
        state.customer = action.payload
      }
  },
})

// Action creators are generated for each case reducer function
export const { setCustomer } = customerSlice.actions

export default customerSlice.reducer