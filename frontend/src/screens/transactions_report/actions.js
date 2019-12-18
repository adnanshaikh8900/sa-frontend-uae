import { TEMP } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const initialData = (obj) => {
  return (dispatch) => {
    
  }
}


export const getCustomerInvoiceReport = () => {
  return (dispatch) => {
    let data ={
      method: 'post',
      url: 'rest/transactionreport/customerInvoiceReport'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: TEMP.CUSTOMER_INVOICE_REPORT,
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


export const getAccountBalanceReport = (postObj) => {
  console.log(postObj)
  // let transactionTypeCode = postObj.filter_type  !== '' ? postObj.filter_type.value : ""
  //  let transactionCategoryId = postObj.filter_category  !== '' ? postObj.filter_category.value : ""
  return (dispatch) => {

 

    let data ={
      method: 'post',
      url: `rest/transactionreport/accountBalanceReport`,
      // url: `rest/transactionreport/accountBalanceReport?transactionTypeCode=${transactionTypeCode}&transactionCategoryId=${transactionCategoryId}`,
      
      data: postObj
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: TEMP.ACCOUNT_BALANCE_REPORT,
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





export const getContactNameList = () => {
  return (dispatch) => {
    let data ={
      method: 'get',
      url: 'rest/contact/contactlist'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: TEMP.CONTACT_LIST,
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

export const getAccountTypeList = () => {
  return (dispatch) => {
    let data ={
      method: 'get',
      url: 'rest/contact/contacttype'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: TEMP.ACCOUNT_TYPE_LIST,
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

export const getTransactionTypeList = () => {
  return (dispatch) => {
    let data ={
      method: 'get',
      url: 'rest/transactioncategory/gettransactiontype'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: TEMP.TRANSACTION_TYPE_LIST,
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

export const getTransactionCategoryList = () => {
  return (dispatch) => {
    let data ={
      method: 'get',
      url: 'rest/transactioncategory/gettransactioncategory'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: TEMP.TRANSACTION_CATEGORY_LIST,
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

