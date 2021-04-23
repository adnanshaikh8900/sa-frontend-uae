import { EMPLOYEE, EMPLOYEE_DESIGNATION } from 'constants/types'
import { Designation } from 'screens'

const initState = {
  employee_list: [],
  currency_list: [],
  country_list: [],
  designation_dropdown:[],

}

const EmployeeReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case EMPLOYEE.EMPLOYEE_LIST: 
      return {
        ...state,
        employee_list: Object.assign([],payload)
      }

      case EMPLOYEE.CURRENCY_LIST: 
      return {
        ...state,
        currency_list: Object.assign([],payload.data)
      }
      case EMPLOYEE.COUNTRY_LIST: 
      return {
        ...state,
        country_list: Object.assign([],payload.data)
      }
      case EMPLOYEE.STATE_LIST: 
      return {
        ...state,
        state_list: Object.assign([],payload.data)
      }
      case EMPLOYEE_DESIGNATION.DESIGNATION_DROPDOWN: 

      return {
        ...state,
        designation_dropdown: Object.assign([],payload.data)
      }
      
    default:
      return state
  }
}

export default EmployeeReducer