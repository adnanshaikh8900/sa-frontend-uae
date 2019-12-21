import { SUPPLIER_INVOICE } from 'constants/types'

const initState = {
  supplier_invoice_list: [],
  project_list : [],
  customer_list : [],
  vendor_list : [],
  currency_list : []
}

const SupplierInvoiceReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case SUPPLIER_INVOICE.SUPPLIER_INVOICE_LIST:
      return {
        ...state,
        supplier_invoice_list: Object.assign([], payload.data)
      }

      case SUPPLIER_INVOICE.PROJECT_LIST:
      return {
        ...state,
        project_list: Object.assign([], payload.data)
      }

      case SUPPLIER_INVOICE.CUSTOMER_LIST:
      return {
        ...state,
        customer_list: Object.assign([], payload.data)
      }

      case SUPPLIER_INVOICE.VENDOR_LIST:
      return {
        ...state,
        vendor_list: Object.assign([], payload.data)
      }
      
      case SUPPLIER_INVOICE.CURRENCY_LIST:
      return {
        ...state,
        currency_list: Object.assign([], payload.data)
      }


    default:
      return state
  }
}

export default SupplierInvoiceReducer