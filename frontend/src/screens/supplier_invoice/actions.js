import { SUPPLIER_INVOICE } from 'constants/types'
import {
  api,
  authApi
} from 'utils'
import moment from 'moment'

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


 
export const getSupplierInoviceList = (postObj) => {
  let supplierName = postObj ? postObj.supplierName : ''
  let referenceNumber =  postObj ? postObj.referenceNumber : ''
  let invoiceDate =  postObj.invoiceDate
  let invoiceDueDate =  postObj.invoiceDueDate
  let amount =  postObj ? postObj.amount : ''
  let status =  postObj ? postObj.status : ''
  
  return (dispatch) => {
    let param = `rest/supplierinvoice/getList?supplierName=${supplierName}&referenceNumber=${referenceNumber}&amount=${amount}&status=${status}`
    if(invoiceDate) {
      let date = moment(invoiceDate).format('DD-MM-YYYY')
      param = param +`&invoiceDate=${date}`
    }
    if(invoiceDueDate) {
      let date = moment(invoiceDueDate).format('DD-MM-YYYY')
      param = param + `&invoiceDueDate=${date}`
    }
    let data ={
      method: 'get',
      url: param
      // data: postObj
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


export const getContactList = (nameCode) => {
  let contactType = nameCode ? nameCode : ""
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `rest/contact/getContactList?contactType=${contactType}`
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: SUPPLIER_INVOICE.CONTACT_LIST,
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


export const getStatusList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/datalist/getInvoiceStatusTypes'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: SUPPLIER_INVOICE.STATUS_LIST,
          payload: res
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

export const removeBulk = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: '/rest/supplierinvoice/deletes',
      data: obj
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        return res
      }
    }).catch(err => {
      throw err
    })
  }
}