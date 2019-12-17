import { EXPENSE } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getExpenseList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/expense/retrieveExpenseList'
    }

    return authApi(data).then(res => {
      dispatch({
        type: EXPENSE.EXPENSE_LIST,
        payload: res.data
      })
      return res
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
          type: EXPENSE.SUPPLIER_LIST,
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

export const getCurrencyList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/bank/getcurrenncy'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: EXPENSE.CURRENCY_LIST,
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
          type: EXPENSE.PROJECT_LIST,
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

export const removeBulkExpenses = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: 'rest/expense/deletes',
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


export const getBankAccountList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/bank/getbanklist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: EXPENSE.BANK_ACCOUNT_LIST,
          payload: {
            data: Object.assign([], res.data)
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
          type: EXPENSE.CUSTOMER_LIST,
          payload: {
            data: Object.assign([], res.data)
          } 
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
      method: 'get',
      url: 'rest/payment/getlist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: EXPENSE.PAYMENT_LIST,
          payload: {
            data: Object.assign([], res.data)
          } 
        })
      }
    }).catch(err => {
      throw err
    })
  }
}