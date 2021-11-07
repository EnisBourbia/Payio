import { configureStore } from '@reduxjs/toolkit'
import companyReducer from './Company'
import modalReducer from './Modal'
import rowsReducer from './InvoiceRow'
import customerReducer from './Customer'
import invoiceReducer from './Invoice'

export default configureStore({
  reducer: {
    company: companyReducer,
    modal: modalReducer,
    rows: rowsReducer,
    customer: customerReducer,
    invoice: invoiceReducer
  },
})