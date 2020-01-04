import { USER } from 'constants/types'
import {
  api,
  authApi,
  authFileUploadApi
} from 'utils'

export const getUserById = (_id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/user/edituser?id=${_id}`
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const updateUser = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/invoice/update',
      data: obj
    }
    return authFileUploadApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const deleteUser = (id) => {
  return (dispatch) => {
    let data = {
      method: 'DELETE',
      url: `/rest/user/deleteuser?id=${id}`
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}