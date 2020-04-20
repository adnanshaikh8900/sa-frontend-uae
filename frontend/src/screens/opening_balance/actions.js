import { OPENING_BALANCE } from 'constants/types'
import {
  authApi
} from 'utils'

export const getTransactionCategoryList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/transactioncategory/getList?paginationDisable=true'
    }
    return authApi(data).then((res) => {
      if (res.status === 200) {
        dispatch({
          type: OPENING_BALANCE.TRANSACTION_CATEGORY_LIST,
          payload: res.data
        })
      }
    }).catch((err) => {
      throw err
    })
  }
}

export const getOpeningBalanceList = (obj) => {
  // let pageNo = obj.pageNo ? obj.pageNo : '';
  // let pageSize = obj.pageSize ? obj.pageSize : '';
  // let order = obj.order ? obj.order : '';
  // let sortingCol = obj.sortingCol ? obj.sortingCol : '';
  // let paginationDisable = obj.paginationDisable ? obj.paginationDisable : false


  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/transactionCategoryBalance/list`
    }
    return authApi(data).then((res) => {
      if(true) {
        dispatch({
          type: OPENING_BALANCE.OPENING_BALANCE_LIST,
          payload: res.data
        })
      }
      return res
    }).catch((err) => {
      throw err
    })
  }
}

export const addOpeningBalance = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/transactionCategoryBalance/save',
      data: obj
    }
    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}

export const updateOpeningBalance = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: 'rest/openingbalance/update',
      data: obj
    }
    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}

export const getOpeningBalanceById = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/openingbalance/getById?id=${id}`
    }

    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}