import { VAT } from 'constants/types'
import {
  authApi
} from 'utils'



// Get Vat List
export const getVatList = (obj) => {
  let name = obj.name ? obj.name : '';
  let vatPercentage = obj.vatPercentage ? obj.vatPercentage : '';
  let pageNo = obj.pageNo ? obj.pageNo : '';
  let pageSize = obj.pageSize ? obj.pageSize : '';
  let paginationDisable = obj.paginationDisable ? obj.paginationDisable : false

  let url;
  if(obj) {
    url = `/rest/vat/getList?name=${name}&vatPercentage=${vatPercentage}&pageNo=${pageNo}&pageSize=${pageSize}&paginationDisable=${paginationDisable}`
  } else {
    url=`/rest/vat/getList`
  }
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: url
    }

    return authApi(data).then(res => {
      if(!obj.paginationDisable) {
        dispatch({
          type: VAT.VAT_LIST,
          payload: res.data
        })
      }
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Get Vat By ID
export const getVatByID = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/vat/getById?id=${id}`
    }

    return authApi(data).then(res => {
      dispatch({
        type: VAT.VAT_ROW,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


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

// // Delete Vat Row
export const deleteVat = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'DELETE',
      url: `/rest/vat/deletes`,
      data: obj
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
