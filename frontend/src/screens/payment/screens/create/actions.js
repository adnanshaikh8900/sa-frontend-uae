import { PAYMENT } from 'constants/types'
import {
  api,
  authApi,
  authFileUploadApi
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

export const getSupplierList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/contact/contactvendorlist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: PAYMENT.SUPPLIER_LIST,
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

export const getInvoiceList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/invoice/invoicelist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: PAYMENT.INVOICE_LIST,
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
          type: PAYMENT.PROJECT_LIST,
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

export const createPayment = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: 'rest/payment/save',
      data: obj
    }
    return authFileUploadApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
