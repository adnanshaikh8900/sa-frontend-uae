import {
  authApi,
  authFileUploadApi
} from 'utils'

export const getQuotationById = (_id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/poquatation/getQuotationById?id=${_id}`
    }

    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}

export const updateQuatation = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/poquatation/updateQuatation',
      data: obj
    }
    return authFileUploadApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}

export const deletePo = (id) => {
  return (dispatch) => {
    let data = {
      method: 'DELETE',
      url: `/rest/poquatation/delete?id=${id}`
    }

    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}