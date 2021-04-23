import { EMPLOYEE, EMPLOYEE_DESIGNATION } from 'constants/types'
import {
  authApi
} from 'utils'

export const getEmployeeList = (obj) => {
  let name = obj.name ? obj.name : '';
  let email = obj.email ? obj.email : '';
  let pageNo = obj.pageNo ? obj.pageNo : '';
  let pageSize = obj.pageSize ? obj.pageSize : '';
  let order = obj.order ? obj.order : '';
  let sortingCol = obj.sortingCol ? obj.sortingCol : '';
  let paginationDisable = obj.paginationDisable ? obj.paginationDisable : false

  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/employee/getList?name=${name}&email=${email}&pageNo=${pageNo}&pageSize=${pageSize}&order=${order}&sortingCol=${sortingCol}&paginationDisable=${paginationDisable}`
    }
    return authApi(data).then((res) => {
      if(!obj.paginationDisable) {
        dispatch({
          type: EMPLOYEE.EMPLOYEE_LIST,
          payload: res.data
        })
      }
      return res
    }).catch((err) => {
      throw err
    })
  }
}

export const getEmployeeDesignationForDropdown = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/employeeDesignation/getEmployeeDesignationForDropdown',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
            type: EMPLOYEE_DESIGNATION.DESIGNATION_DROPDOWN,
						payload: {
							data: res.data,
						},
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};
export const getCurrencyList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/currency/getactivecurrencies'
    }
    return authApi(data).then((res) => {
      if (res.status === 200) {
        dispatch({
          type: EMPLOYEE.CURRENCY_LIST,
          payload: res
        })
      }
    }).catch((err) => {
      throw err
    })
  }
}
export const removeBulkEmployee = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: '/rest/employee/deletes',
      data: obj
    }
    return authApi(data).then((res) => {
      if (res.status === 200) {
        return res
      }
    }).catch((err) => {
      throw err
    })
  }
}

export const getCountryList = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/datalist/getcountry',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
						type: EMPLOYEE.COUNTRY_LIST,
						payload: res.data,
					});
				}
			})
			.catch((err) => {
				throw err;
			});
	};
};

export const getStateList = (countryCode) => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/datalist/getstate?countryCode=' + countryCode,
		};
		if (countryCode) {
			return authApi(data)
				.then((res) => {
					if (res.status === 200) {
						dispatch({
							type: EMPLOYEE.STATE_LIST,
							payload: res.data,
						});
					}
				})
				.catch((err) => {
					throw err;
				});
		} else {
			dispatch({
				type: EMPLOYEE.STATE_LIST,
				payload: [],
			});
		}
	};
};