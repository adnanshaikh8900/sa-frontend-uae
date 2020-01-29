import { BANK_ACCOUNT } from 'constants/types'

const initState = {
  bank_account_list: [],
  bank_transaction_list: [],

  account_type_list: [],
  currency_list: [],
  country_list: [],
  transaction_type_list: [],
  transaction_category_list: [],
  project_list: []
}

const BankAccountReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case BANK_ACCOUNT.BANK_ACCOUNT_LIST:
      return {
        ...state,
        bank_account_list: Object.assign([], payload.data)
      }
    
    case BANK_ACCOUNT.BANK_TRANSACTION_LIST:
      return {
        ...state,
        bank_transaction_list: Object.assign([], payload.data)
      }

    case BANK_ACCOUNT.ACCOUNT_TYPE_LIST:
      return {
        ...state,
        account_type_list: Object.assign([], payload.data)
      }

    case BANK_ACCOUNT.CURRENCY_LIST:
      return {
        ...state,
        currency_list: Object.assign([], payload.data)
      }
    
    case BANK_ACCOUNT.COUNTRY_LIST:
      return {
        ...state,
        country_list: Object.assign([], payload.data)
      }

      case BANK_ACCOUNT.TRANSACTION_CATEGORY_LIST:
        return {
          ...state,
          transaction_category_list : Object.assign([], payload)
        }

        case BANK_ACCOUNT.PROJECT_LIST:
          return {
            ...state,
            project_list : Object.assign([], payload)
          }
    
    default:
      return state
  }
}

export default BankAccountReducer