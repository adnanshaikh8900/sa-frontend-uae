import { CURRENCY } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const initialData = (obj) => {
  return (dispatch) => {
    
  }
}


export const getCurrencyList = () => {
  return (dispatch) => {
    let data ={
      method: 'get',
      url: 'rest/currency'
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        dispatch({
          type: CURRENCY.CURRENCY_LIST,
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



