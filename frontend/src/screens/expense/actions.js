import { EXPENSE } from 'constants/types'
import {
  api,
  authApi
} from 'utils'
import moment from 'moment'

export const getExpenseList = (expenseData) => {
  const { expenseDate, payee, transactionCategoryId, pageNo, pageSize} = expenseData;
  return (dispatch) => {
    let param = `rest/expense/getList?payee=${payee}&transactionCategoryId=${transactionCategoryId}&pageNo=${pageNo}&pageSize=${pageSize}`
    if (expenseDate) {
      let date = moment(expenseDate).format('DD-MM-YYYY')
      param = param + `&expenseDate=${date}`
    }
    let data = {
      method: 'GET',
      url: param
      // data: postObj
    }

    // let data = {
    //   method: 'GET',
    //   url: '/rest/expense/getList'
    // }

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
      url: 'rest/contact/getContactsForDropdown?contactType=1'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: EXPENSE.SUPPLIER_LIST,
          payload: res.data
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
      if (res.status === 200) {
        dispatch({
          type: EXPENSE.CURRENCY_LIST,
          payload: res.data
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
      if (res.status === 200) {
        dispatch({
          type: EXPENSE.PROJECT_LIST,
          payload: res.data
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
      if (res.status === 200) {
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
      if (res.status === 200) {
        dispatch({
          type: EXPENSE.BANK_ACCOUNT_LIST,
          payload: res.data
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
      if (res.status === 200) {
        dispatch({
          type: EXPENSE.CUSTOMER_LIST,
          payload: res.data
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
      if (res.status === 200) {
        dispatch({
          type: EXPENSE.PAYMENT_LIST,
          payload: res.data
        })
      }
      return res;
    }).catch(err => {
      throw err
    })
  }
}

export const getExpenseCategoriesList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/transactioncategory/getForExpenses'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: EXPENSE.EXPENSE_CATEGORIES_LIST,
          payload: res.data
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
      if (res.status === 200) {
        dispatch({
          type: EXPENSE.VAT_LIST,
          payload: res.data
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getEmployeeList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: 'rest/employee/getEmployeesForDropdown'
    }

    return authApi(data).then(res => {
      dispatch({
        type: EXPENSE.EMPLOYEE_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const postExpense = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/expense/posting',
      data: obj
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        return res
      }
    }).catch(err => {
      throw err
    })
  }
}