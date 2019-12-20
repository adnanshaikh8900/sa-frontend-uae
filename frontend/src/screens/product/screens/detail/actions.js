import { PRODUCT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const updateProduct = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `rest/product/update`,
      data: obj
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const getProductById = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `rest/product/getProductById?id=${id}`
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}