import { createSlice } from '@reduxjs/toolkit'

export const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    newRowModal: false,
    editCompanyModal: false,
    clientModal: false,
    applicationModal: false
  },
  reducers: {
    toggleNewRowModal: (state, action) => {
      state.newRowModal = action.payload
    },
    toggleEditCompanyModal: (state, action) => {
      state.editCompanyModal = action.payload
    },
    toggleClientModal: (state, action) => {
      state.clientModal = action.payload
    },
    toggleApplicationModal: (state, action) => {
      state.applicationModal = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleNewRowModal, toggleEditCompanyModal, toggleClientModal, toggleApplicationModal, toggleBudgetIncreaseModal } = modalSlice.actions

export default modalSlice.reducer