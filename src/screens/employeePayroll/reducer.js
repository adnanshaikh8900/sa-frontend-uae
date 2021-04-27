import { EMPLOYEEPAYROLL, EMPLOYEE_DESIGNATION } from 'constants/types'
import { Designation } from 'screens'

const initState = {
  employee_list: [],
  currency_list: [],
  country_list: [],
  designation_dropdown:[],
  salary_structure_dropdown:[],
  employee_list_dropdown:[],
  salary_role_dropdown: [],
  country_list:[],
  state_list:[],

}

const EmployeeReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case EMPLOYEEPAYROLL.EMPLOYEE_LIST: 
      return {
        ...state,
        employee_list: Object.assign([],payload)
      }

      case EMPLOYEEPAYROLL.CURRENCY_LIST: 
      return {
        ...state,
        currency_list: Object.assign([],payload.data)
      }
      case EMPLOYEEPAYROLL.COUNTRY_LIST: 
      return {
        ...state,
        country_list: Object.assign([],payload.data)
      }
      case EMPLOYEEPAYROLL.STATE_LIST: 
      return {
        ...state,
        state_list: Object.assign([],payload.data)
      }
      case EMPLOYEEPAYROLL.DESIGNATION_DROPDOWN: 
      return {
        ...state,
        designation_dropdown: Object.assign([],payload.data)
      }
      case EMPLOYEEPAYROLL.EMPLOYEE_LIST_DDROPDOWN: 

      return {
        ...state,
        employee_list_dropdown: Object.assign([],payload.data)
      }
      case EMPLOYEEPAYROLL.SALARY_ROLE_DROPDOWN: 

      return {
        ...state,
        salary_role_dropdown: Object.assign([],payload.data)
      }
      
      
    default:
      return state
  }
}

export default EmployeeReducer