import { OPENING_BALANCE } from 'constants/types'

const initState = {
  bank_account_list: [],
  currency_list: [],
  opening_balance_list: []
}

const OpeningBalanceReducer = (state = initState, action) => {
  const { type, payload } = action

  switch (type) {

    case OPENING_BALANCE.CURRENCY_LIST:
      return {
        ...state,
        currency_list: Object.assign([], payload.data)
      }

    case OPENING_BALANCE.BANK_ACCOUNT_LIST:
      return {
        ...state,
        bank_account_list: Object.assign([], payload.data)
      }

    case OPENING_BALANCE.OPENING_BALANCE_LIST:
      return {
        ...state,
        opening_balance_list: Object.assign([], payload.data)
      }
    default:
      return state
  }
}

export default OpeningBalanceReducer