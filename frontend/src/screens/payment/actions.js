import { PAYMENT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getPaymentList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `rest/payment/getlist`
    }

    return authApi(data).then(res => {
      dispatch({
        type: PAYMENT.PAYMENT_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
  // return (dispatch) => {
  //   dispatch({
  //     type: PAYMENT.PAYMENT_LIST,
  //     payload: {
  //       data: [{
  //         status: 'paid',
  //         transactionCategoryId: 2, 
  //         transactionCategoryCode: 2,
  //         transactionCategoryName: 'temp',
  //         transactionCategoryDescription: 'temp',
  //         parentTransactionCategory: 'Loream Ipsume',
  //         transactionType: 'TEMP'
  //       }, {
  //         status: 'paid',
  //         transactionCategoryId: 1,
  //         transactionCategoryCode: 4,
  //         transactionCategoryName: 'temp',
  //         transactionCategoryDescription: 'temp',
  //         parentTransactionCategory: 'Loream Ipsume',
  //         transactionType: 'TEMP'
  //       }, {
  //         status: 'paid',
  //         transactionCategoryId: 1,
  //         transactionCategoryCode: 4,
  //         transactionCategoryName: 'temp',
  //         transactionCategoryDescription: 'temp',
  //         parentTransactionCategory: 'Loream Ipsume',
  //         transactionType: 'TEMP'
  //       }, {
  //         status: 'unpaid',
  //         transactionCategoryId: 1,
  //         transactionCategoryCode: 4,
  //         transactionCategoryName: 'temp',
  //         transactionCategoryDescription: 'temp',
  //         parentTransactionCategory: 'Loream Ipsume',
  //         transactionType: 'TEMP'
  //       }, {
  //         status: 'unpaid',
  //         transactionCategoryId: 1,
  //         transactionCategoryCode: 4,
  //         transactionCategoryName: 'temp',
  //         transactionCategoryDescription: 'temp',
  //         parentTransactionCategory: 'Loream Ipsume',
  //         transactionType: 'TEMP'
  //       },{
  //         status: 'paid',
  //         transactionCategoryId: 1,
  //         transactionCategoryCode: 4,
  //         transactionCategoryName: 'temp',
  //         transactionCategoryDescription: 'temp',
  //         parentTransactionCategory: 'Loream Ipsume',
  //         transactionType: 'TEMP'
  //       },{
  //         status: 'unpaid',
  //         transactionCategoryId: 1,
  //         transactionCategoryCode: 4,
  //         transactionCategoryName: 'temp',
  //         transactionCategoryDescription: 'temp',
  //         parentTransactionCategory: 'Loream Ipsume',
  //         transactionType: 'TEMP'
  //       }]        
  //     }
  //   })
  // }
}
