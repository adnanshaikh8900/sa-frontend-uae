import { CONTACT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getContactById = (id) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `rest/contact/editcontact?id=${id}`,
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const updateContact = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: `rest/contact/savecontact`,
      data: obj
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const deleteContact = (id) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: `rest/contact/deletecontact?id=${id}`,
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
