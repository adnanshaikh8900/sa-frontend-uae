import { EXPENSE } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getExpenseDetail = (_id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/expense/getExpenseById?expenseId=${_id}`
    }

    return authApi(data).then(res => {
      dispatch({
        type: EXPENSE.EXPENSE_DETAIL,
        payload: res.data
      })
      return res
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