import { PRODUCT_CATEGORY } from 'constants/types'
import {
  authApi
} from 'utils'



// Get Vat List
export const getProductCategoryList = (obj) => {
  let productCategoryCode = obj.productCategoryCode ? obj.productCategoryCode : '';
  let productCategoryName = obj.productCategoryName ? obj.productCategoryName : '';
  let pageNo = obj.pageNo ? obj.pageNo : '';
  let pageSize = obj.pageSize ? obj.pageSize : '';
  let paginationDisable = obj.paginationDisable ? obj.paginationDisable : ''

  let url;

  if(obj) {
    url = `/rest/productcategory/getList?productCategoryCode=${productCategoryCode}&productCategoryName=${productCategoryName}&pageNo=${pageNo}&pageSize=${pageSize}&paginationDisable=${paginationDisable}`
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
