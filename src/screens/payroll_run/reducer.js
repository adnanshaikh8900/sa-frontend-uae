import { EMPLOYEEPAYROLL } from 'constants/types'

const initState = {
    payroll_employee_list: [],

    employee_list_dropdown: [],

    incompleteEmployeeList:[],
    payroll_list:[],
}

const PayrollRunReducer = (state = initState, action) => {
    const { type, payload } = action

    switch (type) {
        // Vat List
        case EMPLOYEEPAYROLL.PAYROLL_EMPLOYEE_LIST:
            return {
                ...state,
                payroll_employee_list: Object.assign([], payload)
            }
    
        case EMPLOYEEPAYROLL.EMPLOYEE_LIST_DDROPDOWN:
            return {
                ...state,
                employee_list_dropdown: Object.assign([], payload)
            }
     
     

        case EMPLOYEEPAYROLL.INCOMPLETED_EMPLOYEE_LIST:
             
                return {
                    ...state,
                    incompleteEmployeeList: Object.assign([], payload)
                }
        case EMPLOYEEPAYROLL.PAYROLL_LIST:
             
                    return {
                        ...state,
                        payroll_list: Object.assign([], payload)
                    }
        default:
            return state
    }
}

export default PayrollRunReducer

