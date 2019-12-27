import { VAT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'


// Get Vat By ID
export const getProductCategoryById = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/productcategory/getById?id=${id}`
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const updateProductCategory = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/rest/productcategory/update`,
      data: obj
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
