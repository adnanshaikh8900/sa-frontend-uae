import { PRODUCT_CATEGORY } from 'constants/types'
import {
  api,
  authApi
} from 'utils'



// Get Vat List
export const getProductCategoryList = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/productcategory/getList?productCategoryCode=${obj.productCategoryCode}&productCategoryName=${obj.productCategoryName}'
    }

    return authApi(data).then(res => {
      dispatch({
        type: PRODUCT_CATEGORY.PRODUCT_CATEGORY_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const deleteProductCategory = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'DELETE',
      url: `/rest/productcategory/deletes`,
      data: obj
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
