import { CUSTOMER_INVOICE } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getCustomerInoviceList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/customer/getList'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: CUSTOMER_INVOICE.CUSTOMER_INVOICE_LIST,
          payload:  res.data
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
          type: CUSTOMER_INVOICE.PROJECT_LIST,
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
      url: '/rest/contact/getCustomerList'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: CUSTOMER_INVOICE.CUSTOMER_LIST,
          payload:  res
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
//       url: 'rest/contact/contactvendorlist'
//     }
//     return authApi(data).then(res => {
//       if (res.status == 200) {
//         dispatch({
//           type: CUSTOMER_INVOICE.VENDOR_LIST,
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
          type: CUSTOMER_INVOICE.CURRENCY_LIST,
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
          type: CUSTOMER_INVOICE.VAT_LIST,
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
