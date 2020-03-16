import { PRODUCT } from 'constants/types'
import {
  authApi
} from 'utils'

export const getProductList = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/product/getList?name=${obj.name}&productCode=${obj.productCode}&vatPercentage=${obj.vatPercentage}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`
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
    url: `/rest/productwarehouse/saveWareHouse`,
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
      url: '/rest/productwarehouse/getWareHouse'
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
      url: 'rest/datalist/vatCategory'
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
export const getProductCategoryList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/productcategory/getList'
    }

    return authApi(data).then(res => {
      dispatch({
        type: PRODUCT.PRODUCT_CATEGORY,
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
      url: 'rest/product/deletes',
      data: obj
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        return res
      }
    }).catch(err => {
      throw err
    })
  }
}