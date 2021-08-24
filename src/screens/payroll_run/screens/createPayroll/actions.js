import { EMPLOYEEPAYROLL } from 'constants/types';
import {
  authApi
} from 'utils'

 
export const addMultipleEmployees = (obj) => {
	debugger
	return (dispatch) => {
	  let data = {
		method: 'post',
		url: `/rest/Salary/generateSalary`,
		data: obj
	  }
	  return authApi(data).then((res) => {
		return res
	  }).catch((err) => {
		throw err
	  })
	}
  }

  export const createPayrolls = (payPeriod,payrollSubject) => {
    return (dispatch) => {
      let data = {
        method: 'post',
        url:`/rest/payroll/createPayroll ?payrollSubject=${payrollSubject}&payPeriod=${payPeriod}`,
        
      }
      return authApi(data).then((res) => {
        return res
      }).catch((err) => {
        throw err
      })
    }
  }
 
export const getEmployeesForDropdown = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/employee/getEmployeesForDropdown',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
            type: EMPLOYEEPAYROLL.EMPLOYEE_LIST_DDROPDOWN,
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
