import { EXPENSE } from 'constants/types'

const initState = {
  expense_list: [],
  expense_detail: {},
  currency_list: []
}

const ExpenseReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case EXPENSE.EXPENSE_LIST:
      return {
        ...state,
        expense_list: Object.assign([], payload)
      }

      case EXPENSE.EXPENSE_DETAIL:
        return {
          ...state,
          expense_detail: Object.assign({}, payload)
        }

        case EXPENSE.CURRENCY_LIST:
          return {
            ...state,
            currency_list : Object.assign([], payload.data)
          }

    default:
      return state
  }
}

export default ExpenseReducer