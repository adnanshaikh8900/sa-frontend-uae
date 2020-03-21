import { DASHBOARD } from 'constants/types'
import {
  authApi
} from 'utils'

export const initialData = (obj) => {
  return (dispatch) => {
    
  }
}


// Cash Flow Actions

export const getCashFlowGraphData = (daterange) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/transaction/getCashFlow?monthNo='+daterange
    }

    return authApi(data).then(res => {
      dispatch({
        type: DASHBOARD.CASH_FLOW_GRAPH,
         payload: res.data
      })
    }).catch(err => {
      throw err
    })
  }
}


// Invoice Actions

export const getInvoiceGraphData = (daterange) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: 'rest/invoice/getChartData?monthCount='+daterange
    }

    return authApi(data).then(res => {
      dispatch({
        type: DASHBOARD.INVOICE_GRAPH,
        payload:
          res.data
      })
    }).catch(err => {
      throw err
    })
  }
}


// Bank Account Actions

export const getBankAccountTypes = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/bank/list'
    }

    return authApi(data).then(res => {
      dispatch({
        type: DASHBOARD.BANK_ACCOUNT_TYPE,
        payload: res.data.data 
      })
      return res;
    }).catch(err => {
      throw err
    })
  }
}

export const getBankAccountGraphData = (account, daterange) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/bank/getBankChart?bankId='+account+'&monthCount='+daterange
    }
    return authApi(data).then(res => {
      dispatch({
        type: DASHBOARD.BANK_ACCOUNT_GRAPH,
        payload: res.data
      })
    }).catch(err => {
      throw err
    })
  }
}


// Profit and Loss

export const getProfitAndLossData = (startDate, endDate) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/vat/getList'
    }

    return authApi(data).then(res => {
      dispatch({
        type: DASHBOARD.PROFIT_LOSS,
        payload: {
          'income': 180,
          'expenses': 80
        }
      })
      return '1'
    }).catch(err => {
      throw err
    })
  }
}


// Revenues and Expenses

export const getExpensesGraphData = (startDate, endDate) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/vat/getList'
    }

    return authApi(data).then(res => {
      dispatch({
        type: DASHBOARD.EXPENSE_GRAPH,
        payload: {
          'labels': ['Meals', 'Meals', 'Meals', 'Meals', 'Meals', 'Meals', 'Meals', 'Meals', 'Meals'],
          'data': [300, 50, 100, 70, 40, 50, 50, 10, 60, 50]
        }
      })
      return '1'
    }).catch(err => {
      throw err
    })
  }
}

export const getRevenuesGraphData = (startDate, endDate) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/vat/getList'
    }

    return authApi(data).then(res => {
      dispatch({
        type: DASHBOARD.REVENUE_GRAPH,
        payload: {
          'labels': ['Meals', 'Meals', 'Meals', 'Meals', 'Meals', 'Meals', 'Meals', 'Meals', 'Meals'],
          'data': [300, 50, 100, 70, 40, 50, 50, 10, 60, 50]
        }
      })
      return '1'
    }).catch(err => {
      throw err
    })
  }
}
