import { PRODUCT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getProductList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `rest/product/getProductList`
    }

    return authApi(data).then(res => {

      dispatch({
        type: PRODUCT.PRODUCT_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Get Product By ID



// Create & Save Product
export const createAndSaveProduct = (product) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `rest/product/save`,
      data: product
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}



// Create Warehouse
export const createWarehouse = (warehouse) => {
  let data = {
    method: 'POST',
    url: `rest/productwarehouse/savewarehouse`,
    data: warehouse
  }

  return authApi(data).then(res => {
    return res
  }).catch(err => {
    throw err
  })
}


// Get Product Warehouse
export const getProductWareHouseList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: 'rest/productwarehouse/getwarehouse'
    }

    return authApi(data).then(res => {
      dispatch({
        type: PRODUCT.PRODUCT_WHARE_HOUSE,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Get Product VatCategory
export const getProductVatCategoryList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: 'rest/vat/getvat'
    }

    return authApi(data).then(res => {
      dispatch({
        type: PRODUCT.PRODUCT_VAT_CATEGORY,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


// Get Parent Product
export const getParentProductList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: 'rest/product/getProductList'
    }

    return authApi(data).then(res => {
      dispatch({
        type: PRODUCT.PRODUCT_PARENT,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const removeBulk = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: 'rest/product/deleteproducts',
      data: obj
    }
    return authApi(data).then(res => {
      if (res.status == 200) {
        return res
      }
    }).catch(err => {
      throw err
    })
  }
}