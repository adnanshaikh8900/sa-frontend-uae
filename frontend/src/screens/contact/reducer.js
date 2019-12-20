import { CONTACT } from 'constants/types'

const initState = {
  contact_list: [],
  country_list: [],
  currency_list: [],
  state_list: [],
  city_list: []
}

const ContactReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {
    
    case CONTACT.CONTACT_LIST:
      return {
        ...state,
        contact_list: Object.assign([], payload)
      }

      case CONTACT.COUNTRY_LIST:
        return {
          ...state,
          country_list: Object.assign([], payload)
        }

        case CONTACT.CURRENCY_LIST:
          return {
            ...state,
            currency_list: Object.assign([], payload)
          }

          case CONTACT.STATE_LIST:
            return {
              ...state,
              currency_list: Object.assign([], payload)
            }

            case CONTACT.CITY_LIST:
              return {
                ...state,
                currency_list: Object.assign([], payload)
              }

    default:
      return state
  }
}

export default ContactReducer