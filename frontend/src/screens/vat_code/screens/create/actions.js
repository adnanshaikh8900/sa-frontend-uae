import { VAT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'


// Create & Save Vat
export const createVat = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/rest/vat/save`,
      data: obj
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

// export const getVatList = () => {
//   return (dispatch) => {
//     let data = {
//       method: 'GET',
//       url: `/rest/vat/getList`
//     }

//     return authApi(data).then(res => {
//       dispatch({
//         type: VAT.VAT_LIST,
//         payload: res.data
//       })
//       return res
//     }).catch(err => {
//       throw err
//     })
//   }
// }
