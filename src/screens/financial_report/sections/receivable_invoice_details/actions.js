import {
  authApi
} from 'utils'

export const getReceivableInvoiceDetail = (postData) => {
  const { startDate, endDate} = postData
  let url = `/rest/simpleaccountReports/ReceivableInvoiceDetail?startDate=${startDate}&endDate=${endDate}`
  return (dispatch) => {
    let data = {
      method: 'get',
      url
    }
    return authApi(data).then((res) => {
      if (res.status === 200) {
        // dispatch({
        //   type: EMPLOYEE.CURRENCY_LIST,
        //   payload: res
        // })
        return res
      }
    }).catch((err) => {
      throw err
    })
  }
}

export const getTransactionCategoryList = () => {
  return (dispatch) => {
    let data ={
      method: 'get',
      url: '/rest/transactioncategory/getList'
    }
    return authApi(data).then((res) => {
      if (res.status === 200) {
        return res
      }
    }).catch((err) => {
      throw err
    })
  }
}
