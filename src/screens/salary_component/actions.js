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

export const getSalaryComponentById = (_id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/payroll/getSalaryComponentById?id=${_id}`
    }

    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}

