import { CHART_ACCOUNT } from 'constants/types'
import {
  authApi
} from 'utils'

export const getTransactionTypes = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `rest/datalist/getTransactionTypes`
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

export const getTransactionCategoryList = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/transactioncategory/getList?transactionCategoryCode=${obj.transactionCategoryCode}&transactionCategoryName=${obj.transactionCategoryName}&transactionType=${obj.transactionType}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`,
    }

    return authApi(data).then(res => {
      dispatch({
        type: CHART_ACCOUNT.TRANSACTION_CATEGORY_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}




export const removeBulk = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: 'rest/transactioncategory/deleteTransactionCategories',
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
