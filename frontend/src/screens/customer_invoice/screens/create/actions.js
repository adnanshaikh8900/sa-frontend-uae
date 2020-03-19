import {
  authApi,
  authFileUploadApi
} from 'utils'

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

export const getInvoiceNo = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/invoice/getNextInvoiceNo`
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}