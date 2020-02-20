import { VAT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'



// Get Vat List
export const getVatList = (obj) => {
  let url;
  if(obj) {
    url = `/rest/vat/getList?name=${obj.name}&vatPercentage=${obj.vatPercentage}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`
  } else {
    url=`/rest/vat/getList`
  }
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: url
    }

    return authApi(data).then(res => {
      dispatch({
        type: VAT.VAT_LIST,
        payload: res.data
      })
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
