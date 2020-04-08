import { OPENING_BALANCE } from 'constants/types'
import {
  authApi
} from 'utils'

export const getCurrencyList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/bank/getcurrenncy'
    }
    return authApi(data).then((res) => {
      if (res.status === 200) {
        dispatch({
          type: OPENING_BALANCE.CURRENCY_LIST,
          payload: res
        })
      }
    }).catch((err) => {
      throw err
    })
  }
}

export const getBankList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/bank/list'
    }
    return authApi(data).then((res) => {
      if (res.status === 200) {
        dispatch({
          type: OPENING_BALANCE.BANK_ACCOUNT_LIST,
          payload: res.data
        })
      }
    }).catch((err) => {
      throw err
    })
  }
}