import {
  authFileUploadApi
} from 'utils'

export const initialData = (obj) => {
  return (dispatch) => {
    
  }
}


export const createInvoice = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: 'rest/invoice/save',
      data: obj
    }
    return authFileUploadApi(data).then(res => {
      return res
    })
    .catch(err => {
      throw err
    })
  }
}