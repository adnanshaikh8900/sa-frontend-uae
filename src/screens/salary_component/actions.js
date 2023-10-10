import {
  authApi
} from 'utils'


export const saveSalaryComponent = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/payroll/saveSalaryComponent',
      data: obj
    }
    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}
export const updateSalaryComponent = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/payroll/updateSalaryComponent',
      data: obj
    }
    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}
export const deleteSalaryComponent = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: '/rest/payroll/deleteSalaryComponent',
      data: obj
    }
    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}


