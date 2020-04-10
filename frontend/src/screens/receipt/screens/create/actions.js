import {
  authApi
} from 'utils'

export const createReceipt = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: 'rest/receipt/save',
      data: obj
    }
    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}