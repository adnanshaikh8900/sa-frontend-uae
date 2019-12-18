import { CHART_ACCOUNT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getTransactionCategoryById = (id) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `rest/transactioncategory/edittransactioncategory?id=${id}`,
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
