import { BANK_ACCOUNT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getTransactionList = (id) => {
  return (dispatch) => {
    let data ={
      method: 'get',
      url: `/rest/transaction/list?bankId=${id}`
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: BANK_ACCOUNT.BANK_TRANSACTION_LIST,
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
      url: '/rest/transactioncategory/getList'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: BANK_ACCOUNT.TRANSACTION_CATEGORY_LIST,
          payload:  res.data
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
      url: '/rest/datalist/getTransactionTypes'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: BANK_ACCOUNT.TRANSACTION_TYPE_LIST,
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
    let data ={
      method: 'get',
      url: '/rest/project/getList'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: BANK_ACCOUNT.PROJECT_LIST,
          payload: res.data
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

// data: [{
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Explained',
//   reference_number: 'KDF3920342',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }, {
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Explained',
//   reference_number: 'KDF3929865',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }, {
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Unexplained',
//   reference_number: 'KDF39206574',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }, {
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Explained',
//   reference_number: 'KDF392394',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }, {
//   transaction_type: 'Debit',
//   amount: 3453246,
//   status: 'Unexplained',
//   reference_number: 'KDF3920923',
//   description: 'This is description',
//   transaction_date: 'Oct 28th, 2019'
// }]