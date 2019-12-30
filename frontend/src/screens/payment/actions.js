import { PAYMENT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'
import moment from 'moment'

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
          payload: res
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
      url: `/rest/contact/getContactsForDropdown?contactType=1`
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
      url: 'rest/project/getList'
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

export const getPaymentList = (paymentData) => {
  const { supplierId, paymentDate, invoiceAmount, pageNo, pageSize } = paymentData;
  return (dispatch) => {
    let param = `rest/payment/getlist?supplierId=${supplierId ? supplierId : ''}&invoiceAmount=${invoiceAmount}&pageNo=${pageNo}&pageSize=${pageSize}`
    if (paymentDate) {
      let date = moment(paymentDate).format('DD-MM-YYYY')
      param = param + `&paymentDate=${date}`
    }
    let data = {
      method: 'get',
      url: param
      // data: postObj
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
export const removeBulkPayments = (obj) => {
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

export const createSupplier = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: 'rest/contact/save',
      data: obj
    }
    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
