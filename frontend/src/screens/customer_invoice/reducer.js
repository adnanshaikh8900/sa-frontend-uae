import { CUSTOMER_INVOICE } from 'constants/types'

const initState = {
  customer_invoice_list: [],
  project_list: [],
  customer_list: [],
  currenct_list: [],
  vat_list: [],
  vendor_list: []
}

const CustomerInvoiceReducer = (state = initState, action) => {
  const { type, payload } = action

  switch (type) {

    case CUSTOMER_INVOICE.CUSTOMER_INVOICE_LIST:
      return {
        ...state,
        customer_invoice_list: Object.assign([], payload.data)
      }

    case CUSTOMER_INVOICE.PROJECT_LIST:
      return {
        ...state,
        project_list: Object.assign([], payload.data)
      }

    case CUSTOMER_INVOICE.CUSTOMER_LIST:
      return {
        ...state,
        customer_list: Object.assign([], payload.data)
      }

    case CUSTOMER_INVOICE.VENDOR_LIST:
      return {
        ...state,
        vendor_list: Object.assign([], payload.data)
      }

    case CUSTOMER_INVOICE.CURRENCY_LIST:
      return {
        ...state,
        currency_list: Object.assign([], payload.data)
      }


    case CUSTOMER_INVOICE.VAT_LIST:
      return {
        ...state,
        vat_list: Object.assign([], payload.data)
      }



    default:
      return state
  }
}

export default CustomerInvoiceReducer