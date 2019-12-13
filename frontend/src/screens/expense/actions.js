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
