import {
  authFileUploadApi
} from 'utils'


export const createTransaction = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/transaction/save',
      data: obj
    }
    return authFileUploadApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}
