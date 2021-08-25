import { EMPLOYEEPAYROLL} from 'constants/types'

import {
    authApi
  } from 'utils'


    export const getPayrollEmployeeList = (presentDate) => {
    
        let url = `/rest/Salary/getSalaryPerMonthList?presentDate=${presentDate}`;
    
        return (dispatch) => {
            let data = {
                method: 'get',
                url,
            };
            return authApi(data)
                .then((res) => {
                    if (res.status === 200) {
                        dispatch({
                            type:EMPLOYEEPAYROLL.PAYROLL_EMPLOYEE_LIST,
                            payload: res.data,
                        });
                    }
                })
                .catch((err) => {
                    throw err;
                });
        };
    };
    export const getIncompletedEmployeeList = () => {
    
      let url = `/rest/Salary/getIncompleteEmployeeList`;
  
      return (dispatch) => {
          let data = {
              method: 'get',
              url,
          };
          return authApi(data)
              .then((res) => {
                  if (res.status === 200) {
                      dispatch({
                          type:EMPLOYEEPAYROLL.INCOMPLETED_EMPLOYEE_LIST,
                          payload: res.data.incompleteEmployeeList,
                      });
                  }
              })
              .catch((err) => {
                  throw err;
              });
      };
  };

    export const getSalaryDetailByEmployeeIdNoOfDays = (_id) => {
        return (dispatch) => {
            let data = {
                method: 'GET',
                url: `/rest/payroll/getSalaryDetailByEmployeeIdNoOfDays?id=${_id}`,
            };
    
            return authApi(data)
                .then((res) => {
                    return res;
                })
                .catch((err) => {
                    throw err;
                });
        };
    };

    export const updateSalaryComponentAsNoOfDays = (obj) => {
        return (dispatch) => {
          let data = {
            method: 'post',
            url: '/rest/payroll/updateSalaryComponentAsNoOfDays',
            data: obj
          }
          return authApi(data).then((res) => {
            return res
          }).catch((err) => {
            throw err
          })
        }
      }
     
      export const generateSalary = (obj) => {
        return (dispatch) => {
          let data = {
            method: 'post',
            url: '/rest/Salary/generateSalary',
            data: obj
          }
          return authApi(data).then((res) => {
            return res
          }).catch((err) => {
            throw err
          })
        }
      }

      

      export const getPayrollList = () => {
    
        let url = `/rest/payroll/getPayrollList`;
    
        return (dispatch) => {
            let data = {
                method: 'get',
                url,
            };
            return authApi(data)
                .then((res) => {
                    if (res.status === 200) {
                        dispatch({
                            type:EMPLOYEEPAYROLL.PAYROLL_LIST,
                            payload: res.data,
                        });
                    }
                })
                .catch((err) => {
                    throw err;
                });
        };
    };

    // export const getUserAndRole = (_id) => {
    //     return (dispatch) => {
    //         let data = {
    //             method: 'GET',
    //             url: `/rest/payroll/getUserAndRole`,
    //         };
    
    //         return authApi(data)
    //             .then((res) => {
    //                 return res;
    //             })
    //             .catch((err) => {
    //                 throw err;
    //             });
    //     };
    // };
    export const getUserAndRole = () => {
        return (dispatch) => {
            let data = {
                method: 'get',
                url: '/rest/payroll/getUserAndRole',
            };
            return authApi(data)
                .then((res) => {
                    if (res.status === 200) {
                        dispatch({
                type: EMPLOYEEPAYROLL.USER_APPROVER_GENERATER_DROPDOWN,
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
    