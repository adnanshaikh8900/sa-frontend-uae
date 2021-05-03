import {
  authApi
} from 'utils'

export const getEmployeeDesignationById = (_id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/employeeDesignation/getEmployeeDesignationById?id=${_id}`
    }

    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}

export const updateEmployeeDesignation = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/employeeDesignation/updateEmployeeDesignation',
      data: obj
    }
    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}

export const deleteEmployee = (id) => {
  return (dispatch) => {
    let data = {
      method: 'DELETE',
      url: `/rest/employee/delete?id=${id}`
    }

    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}
