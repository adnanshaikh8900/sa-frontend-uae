import { BANK_STATEMENT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getBankStatementList = () => {
  return (dispatch) => {
    dispatch({
      type: BANK_STATEMENT.BANK_STATEMENT_LIST,
      payload: {
        data: [{
          transaction_type: 'Debit',
          amount: 3453246,
          reference_number: 'KDF3920342',
          description: 'This is description',
          transaction_date: 'Oct 28th, 2019'
        }, {
          transaction_type: 'Debit',
          amount: 3453246,
          reference_number: 'KDF3929865',
          description: 'This is description',
          transaction_date: 'Oct 28th, 2019'
        }, {
          transaction_type: 'Debit',
          amount: 3453246,
          reference_number: 'KDF39206574',
          description: 'This is description',
          transaction_date: 'Oct 28th, 2019'
        }, {
          transaction_type: 'Debit',
          amount: 3453246,
          reference_number: 'KDF392394',
          description: 'This is description',
          transaction_date: 'Oct 28th, 2019'
        }, {
          transaction_type: 'Debit',
          amount: 3453246,
          reference_number: 'KDF3920923',
          description: 'This is description',
          transaction_date: 'Oct 28th, 2019'
        }]
      }
    })
  }
}
