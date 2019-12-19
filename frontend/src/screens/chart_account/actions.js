import { CHART_ACCOUNT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getTransactionTypes = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `rest/transactioncategory/gettransactiontype`
    }

    return authApi(data).then(res => {
      dispatch({
        type: CHART_ACCOUNT.TRANSACTION_TYPES,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const getTransactionList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `rest/transactioncategory/gettransactioncategory`
    }

    return authApi(data).then(res => {
      dispatch({
        type: CHART_ACCOUNT.TRANSACTION_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


export const createTransactionCategory = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: `rest/transactioncategory/savetransactioncategory`,
      data: obj
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}