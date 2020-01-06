import { PROFILE } from 'constants/types'

const initState = {
  currency_list: [],
  country_list: [],
  industry_type_list: [],
  company_type_list: []
}

const ProfileReducer = (state = initState, action) => {
  const { type, payload} = action
  
  switch(type) {

    case PROFILE.CURRENCY_LIST:
      return {
        ...state,
        currency_list: Object.assign([], payload)
      }

    case PROFILE.COUNTRY_LIST:

      return {
        ...state,
        country_list: Object.assign([], payload)
      }

    case PROFILE.INDUSTRY_TYPE_LIST:

      return {
        ...state,
        industry_type_list: Object.assign([], payload)
      }


    case PROFILE.COMPANY_TYPE_LIST:
      return {
        ...state,
        company_type_list: Object.assign([], payload)
      }

    default:
      return state
  }
}

export default ProfileReducer