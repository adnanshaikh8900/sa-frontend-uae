import { TEMP } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const initialData = (obj) => {
  return (dispatch) => {
    
  }
}


export const getCustomerInvoiceReport = (inputObj) => {
  
  let startDate = inputObj && inputObj.startDate  !== '' ? `startDate=${inputObj.startDate}` : ""
  let endDate = inputObj && inputObj.endDate  !== '' ? `endDate=${inputObj.endDate}` : ""
  let contactId = inputObj && inputObj.contactName  !== '' ? `contactId=${inputObj.contactName.value}` : ""  
  let refNumber =  inputObj && inputObj.refNumber  !== '' ? `refNumber=${inputObj.refNumber}` : ""

  return (dispatch) => {
    let data ={
      method: 'post',
      
      url: `rest/transactionreport/customerInvoiceReport?${refNumber}&${contactId}`,
      // url: 'rest/transactionreport/customerInvoiceReport'  ,
      data: inputObj    
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
let transactionTypeCode,transactionCategoryId,accountId

    transactionTypeCode  = postObj && postObj.filter_type  !== '' ?  `transactionTypeCode=${postObj.filter_type.value}`  : "" 
    transactionCategoryId = postObj && postObj.filter_category  !== '' ?  `transactionCategoryId=${postObj.filter_category.value}` : "" 
    accountId = postObj && postObj.filter_account  !== '' ?  `accountId=${postObj.filter_account.value}` : "" 
    
  return (dispatch) => {

   
    let data ={
      method: 'post',
      url: `rest/transactionreport/accountBalanceReport?${transactionTypeCode}&${transactionCategoryId}&${accountId}`,
      // url: `rest/transactionreport/accountBalanceReport`,      
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
      url: 'rest/bank/getaccounttype'
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
      url: 'rest/transactionreport/getTransactionTypes'
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

