import {
    authApi
  } from 'utils'


  export const getSalaryComponentByEmployeeId = (_id) => {
	return (dispatch) => {
	  let data = {
		method: 'GET',
		url: `/rest/payroll/getSalaryComponentByEmployeeId?id=${_id}`
	  }
  
	  return authApi(data).then((res) => {
		return res
	  }).catch((err) => {
		throw err
	  })
	}
  }

  export const updateEmployeeBank = (obj) => {
    return (dispatch) => {
      let data = {
        method: 'POST',
        url: `/rest/payroll/updateSalaryComponent`,
        data: obj
      }
  
      return authApi(data).then((res) => {
        return res
      }).catch((err) => {
        throw err
      })
    }
  }