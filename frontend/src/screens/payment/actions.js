import { PAYMENT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getPaymentList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `rest/payment/getlist`
    }

    return authApi(data).then(res => {
      dispatch({
        type: PAYMENT.PAYMENT_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}
export const removeBulkPayments= (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: 'rest/payment/deletes',
      data: obj
    }
    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

