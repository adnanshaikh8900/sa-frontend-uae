import { PRODUCT_CATEGORY } from 'constants/types'
import {
  api,
  authApi
} from 'utils'



// Get Vat List
export const getProductCategoryList = (obj) => {
  let url;
  if(obj) {
    url = `/rest/productcategory/getList?productCategoryCode=${obj.productCategoryCode}&productCategoryName=${obj.productCategoryName}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`
  } else {
    url=`/rest/productcategory/getList`
  }
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: url
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
