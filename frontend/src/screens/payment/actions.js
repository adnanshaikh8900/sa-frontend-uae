import { PAYMENT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getCurrencyList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/bank/getcurrenncy'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: PAYMENT.CURRENCY_LIST,
          payload: res
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getBankList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/bank/getbanklist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: PAYMENT.BANK_LIST,
          payload:  res
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getSupplierList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/contact/getContactList'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: PAYMENT.SUPPLIER_LIST,
          payload: res
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getSupplierInvoiceList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/invoice/invoicelist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: PAYMENT.INVOICE_LIST,
          payload: res
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
          type: PAYMENT.PROJECT_LIST,
          payload: res
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getPaymentList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `rest/payment/getlist`
    }

    return authApi(data).then(res => {
      dispatch({
        type: PAYMENT.PAYMENT_LIST,
        payload: res
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}
export const removeBulkPayments= (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: 'rest/payment/deletes',
      data: obj
    }
    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

