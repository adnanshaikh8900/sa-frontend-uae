import { USER } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getUserList = (obj) => {

  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/user/getuserlist`
      // ?projectName=${obj.projectName}&expenseBudget=${obj.expenseBudget}&revenueBudget=${obj.revenueBudget}&vatRegistrationNumber=${obj.vatRegistrationNumber}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`
    }

    return authApi(data).then(res => {

      dispatch({
        type: USER.USER_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


export const getRoleList = (obj) => {

  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/user/getrole`
      // ?projectName=${obj.projectName}&expenseBudget=${obj.expenseBudget}&revenueBudget=${obj.revenueBudget}&vatRegistrationNumber=${obj.vatRegistrationNumber}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`
    }

    return authApi(data).then(res => {

      dispatch({
        type: USER.ROLE_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const removeBulk = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: '/rest/user/deleteusers',
      data: obj
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        return res
      }
    }).catch(err => {
      throw err
    })
  }
}