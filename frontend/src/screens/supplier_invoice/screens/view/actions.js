import { SUPPLIER_INVOICE } from 'constants/types'
import {
  api,
  authApi,
  authFileUploadApi
} from 'utils'

export const getInvoiceById = (_id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/invoice/getInvoiceById?id=${_id}`
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
