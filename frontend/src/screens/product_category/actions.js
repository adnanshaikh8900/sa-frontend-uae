import { PRODUCT_CATEGORY } from 'constants/types'
import {
  api,
  authApi
} from 'utils'



// Get Vat List
export const getProductCategoryList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/productcategory/getList'
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


// Get Vat By ID
// export const getVatByID = (id) => {
//   return (dispatch) => {
//     let data = {
//       method: 'GET',
//       url: `rest/vat/getbyid?id=${id}`
//     }

//     return authApi(data).then(res => {
//       dispatch({
//         type: VAT.VAT_ROW,
//         payload: res.data
//       })
//       return res
//     }).catch(err => {
//       throw err
//     })
//   }
// }


// Create & Save Bat
// export const createBat = (bat) => {
//   return (dispatch) => {
//     let data = {
//       method: 'POST',
//       url: `rest/vat/savevat?id=1`,
//       data: bat
//     }

//     return authApi(data).then(res => {
//       return res
//     }).catch(err => {
//       throw err
//     })
//   }
// }

// Delete Vat Row
export const deletePRODUCTCategory = (ids) => {
  return (dispatch) => {
    let data = {
      method: 'DELETE',
      url: `rest/vat/deletevats?id=1`,
      data: {ids: ids}
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
