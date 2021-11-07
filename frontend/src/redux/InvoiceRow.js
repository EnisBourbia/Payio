import { createSlice } from '@reduxjs/toolkit'

export const invoiceRowSlice = createSlice({
  name: 'modal',
  initialState: {
      rows: []
  },
  reducers: {
    addRow: (state, action) => {
      state.rows = [...state.rows, action.payload]
    },
    deleteRow: (state, action) => {
      state.rows = state.rows.filter((item, index) => index !== action.payload)
      console.log(action)
    }
  },
})

// Action creators are generated for each case reducer function
export const { addRow, deleteRow} = invoiceRowSlice.actions

export default invoiceRowSlice.reducer