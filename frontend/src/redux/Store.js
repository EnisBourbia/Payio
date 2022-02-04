import { configureStore } from '@reduxjs/toolkit'
import companyReducer from './Company'
import modalReducer from './Modal'
import customerReducer from './Customer'
import invoiceReducer from './Invoice'
import userReducer from './User'
import todoReducer from './Todo'

export default configureStore({
  reducer: {
    user: userReducer,
    todo: todoReducer,
    company: companyReducer,
    modal: modalReducer,
    customer: customerReducer,
    invoice: invoiceReducer
  },
})