import { SUPPLIER_INVOICE } from 'constants/types'
import {
  api,
  authApi
} from 'utils'


export const getSupplierInoviceList = (postObj) => {
  let customerName = postObj ? postObj.customerName : ''
  let referenceNumber =  postObj ? postObj.referenceNumber : ''
  let invoiceDate =  postObj ? postObj.invoiceDate : ''
  let invoiceDueDate =  postObj ? postObj.invoiceDueDate : ''
  let amount =  postObj ? postObj.amount : ''
  let status =  postObj ? postObj.status : ''
  let contactType = postObj ? postObj.contactType : ''
  return (dispatch) => {
    let data ={
      method: 'get',
      // url: `rest/invoice/getList?type=${contactType}&customerName=${customerName}&referenceNumber=${referenceNumber}&amount=${amount}&status=${status}`,      
      url: `rest/invoice/getList?type=${contactType}`,
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
      url: 'rest/project/getProjectsForDropdown'
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
      url: `rest/contact/getContactsForDropdown?contactType=${contactType}`
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


// export const getVendorList = () => {
//   return (dispatch) => {
//     let data = {
//       method: 'get',
//       url: 'rest/contact/getSupplierList'
//     }
//     return authApi(data).then(res => {
//       if (res.status == 200) {
//         dispatch({
//           type: SUPPLIER_INVOICE.VENDOR_LIST,
//           payload:  {
//             data: res.data
//           }
//         })
//       }
//     }).catch(err => {
//       throw err
//     })
//   }
// }


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