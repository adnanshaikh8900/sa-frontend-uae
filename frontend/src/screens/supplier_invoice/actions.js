import { SUPPLIER_INVOICE } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

// export const getSupplierInoviceList = () => {
//   return (dispatch) => {
//     dispatch({
//       type: SUPPLIER_INVOICE.SUPPLIER_INVOICE_LIST,
//       payload: {
//         data: [{
//           status: 'paid',
//           transactionCategoryId: 2,
//           transactionCategoryCode: 2,
//           transactionCategoryName: 'temp',
//           transactionCategoryDescription: 'temp',
//           parentTransactionCategory: 'Loream Ipsume',
//           transactionType: 'TEMP'
//         }, {
//           status: 'paid',
//           transactionCategoryId: 1,
//           transactionCategoryCode: 3,
//           transactionCategoryName: 'temp',
//           transactionCategoryDescription: 'temp',
//           parentTransactionCategory: 'Loream Ipsume',
//           transactionType: 'TEMP'
//         }, {
//           status: 'Partially Paid',
//           transactionCategoryId: 1,
//           transactionCategoryCode: 4,
//           transactionCategoryName: 'temp',
//           transactionCategoryDescription: 'temp',
//           parentTransactionCategory: 'Loream Ipsume',
//           transactionType: 'TEMP'
//         }, {
//           status: 'unpaid',
//           transactionCategoryId: 1,
//           transactionCategoryCode: 5,
//           transactionCategoryName: 'temp',
//           transactionCategoryDescription: 'temp',
//           parentTransactionCategory: 'Loream Ipsume',
//           transactionType: 'TEMP'
//         }, {
//           status: 'unpaid',
//           transactionCategoryId: 1,
//           transactionCategoryCode: 6,
//           transactionCategoryName: 'temp',
//           transactionCategoryDescription: 'temp',
//           parentTransactionCategory: 'Loream Ipsume',
//           transactionType: 'TEMP'
//         },{
//           status: 'paid',
//           transactionCategoryId: 1,
//           transactionCategoryCode: 7,
//           transactionCategoryName: 'temp',
//           transactionCategoryDescription: 'temp',
//           parentTransactionCategory: 'Loream Ipsume',
//           transactionType: 'TEMP'
//         },{
//           status: 'unpaid',
//           transactionCategoryId: 1,
//           transactionCategoryCode: 8,
//           transactionCategoryName: 'temp',
//           transactionCategoryDescription: 'temp',
//           parentTransactionCategory: 'Loream Ipsume',
//           transactionType: 'TEMP'
//         }]
//       }
//     })
//   }
// }



export const getSupplierInoviceList = () => {
  return (dispatch) => {
    let data ={
      method: 'get',
      url: 'rest/invoice/invoicelist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: SUPPLIER_INVOICE.SUPPLIER_INVOICE_LIST,
          payload: {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}


export const getProjectList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/project/getprojects'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: SUPPLIER_INVOICE.PROJECT_LIST,
          payload:  {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}


export const getCustomerList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/contact/contactcustomerlist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: SUPPLIER_INVOICE.CUSTOMER_LIST,
          payload:  {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}


export const getVendorList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/contact/contactvendorlist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: SUPPLIER_INVOICE.VENDOR_LIST,
          payload:  {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}


export const getCurrencyList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/bank/getcurrenncy'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: SUPPLIER_INVOICE.CURRENCY_LIST,
          payload:  {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}


export const getVatList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/vat/getvat'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: SUPPLIER_INVOICE.VAT_LIST,
          payload:  {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}