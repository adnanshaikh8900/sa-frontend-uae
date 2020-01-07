import { USER } from 'constants/types'
import {
  api,
  authApi
} from 'utils'
import moment from 'moment'

export const getUserList = (obj) => {
  let url = `/rest/user/getList?name=${obj.name}&roleId=${obj.roleId}&active=${obj.active}&companyId=${obj.companyId}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`
  if(obj.dob !== '') {
    // let date = moment(obj.dob).format('DD-MM-YYYY')
    url = url +`&dob=${obj.dob}`
  }
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: url
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
      url: '/rest/user/deletes',
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

export const getCompanyTypeList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/rest/company/getCompaniesForDropdown`
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: USER.COMPANY_TYPE_LIST,
          payload: res.data
        })
      }
    }).catch(err => {
      throw err
    })
  }
}