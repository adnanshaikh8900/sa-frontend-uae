import { EMPLOYEEPAYROLL } from 'constants/types';
import {
  authApi
} from 'utils'


export const addMultipleEmployees = (payrollId,employeeListIds) => {
	
	return (dispatch) => {
	  let data = {
		method: 'post',
		url: `/rest/payroll/savePayrollEmployeeRelation ?payrollId=${payrollId}&employeeListIds=${employeeListIds}`,
		// data: obj
	  }
	  return authApi(data).then((res) => {
		return res
	  }).catch((err) => {
		throw err
	  })
	}
  }
 
  export const getPayrollById = (_id) => {
	return (dispatch) => {
	  let data = {
		method: 'GET',
		url: `/rest/payroll/getPayroll?id=${_id}`
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

export const getApproversForDropdown = () => {
	return (dispatch) => {
		let data = {
			method: 'get',
			url: '/rest/payroll/getAproverUsers',
		};
		return authApi(data)
			.then((res) => {
				if (res.status === 200) {
					dispatch({
            type: EMPLOYEEPAYROLL.APPROVER_DROPDOWN,
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


export const getAllPayrollEmployee = (_id) => {
	return (dispatch) => {
	  let data = {
		method: 'GET',
		url: `/rest/payroll/getAllPayrollEmployee?payrollid=${_id}`
	  }
  
	  return authApi(data).then((res) => {
		return res
	  }).catch((err) => {
		throw err
	  })
	}
}
export const removeEmployee = (ids) => {
	return (dispatch) => {
	  let data = {
		method: 'DELETE',
		url: `/rest/payroll/removeEmployee?payEmpListIds=${ids}`
	  }
  
	  return authApi(data).then((res) => {
		return res
	  }).catch((err) => {
		throw err
	  })
	}
}


export const generatePayroll = (payrollId,string,date) => {
	
	return (dispatch) => {
	  let data = {
		method: 'post',
		url: `/rest/payroll/generatePayroll?generatePayrollString=${string}&payrollId=${payrollId}&salaryDate=${date}`,
		// data: obj
	  }
	  return authApi(data).then((res) => {
		return res
	  }).catch((err) => {
		throw err
	  })
	}
  }
  export const approveAndRunPayroll = (payrollId) => {
	
	return (dispatch) => {
	  let data = {
		method: 'post',
		url: `/rest/payroll/approveRunPayroll?payrollId=${payrollId}`,
		// data: obj
	  }
	  return authApi(data).then((res) => {
		return res
	  }).catch((err) => {
		throw err
	  })
	}
  }
 
 
  