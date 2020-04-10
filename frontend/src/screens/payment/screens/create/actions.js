import {
  authFileUploadApi
} from 'utils'

export const createPayment = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: 'rest/payment/save',
      data: obj
    }
    return authFileUploadApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}
