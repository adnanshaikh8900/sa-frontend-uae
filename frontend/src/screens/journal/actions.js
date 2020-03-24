import { JOURNAL } from 'constants/types'
import {
  authApi
} from 'utils'
import moment from 'moment'


export const getJournalList = (obj) => {
  const { journalDate , journalReferenceNo , description,pageNo,pageSize,order,sortingCol} = obj
  let url = `/rest/journal/getList?journalReferenceNo=${journalReferenceNo}&description=${description}&pageNo=${pageNo}&pageSize=${pageSize}&order=${order}&sortingCol=${sortingCol}`
  if(journalDate) {
    let date = moment(journalDate).format('DD-MM-YYYY')
    url = url + `&journalDate=${date}`
  }
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: url
    }

    return authApi(data).then(res => {
      dispatch({
        type: JOURNAL.JOURNAL_LIST,
        payload: res
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


export const getCurrencyList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/bank/getcurrenncy'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: JOURNAL.CURRENCY_LIST,
          payload: res
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getTransactionCategoryList = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/transactioncategory/getList`,
    }

    return authApi(data).then(res => {
      dispatch({
        type: JOURNAL.TRANSACTION_CATEGORY_LIST,
        payload: res
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


export const getContactList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/contact/getContactsForDropdown`
    }

    return authApi(data).then(res => {
      dispatch({
        type: JOURNAL.CONTACT_LIST,
        payload: res
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const getVatList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/datalist/vatCategory'
    }

    return authApi(data).then(res => {
      dispatch({
        type: JOURNAL.VAT_LIST,
        payload: res
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}


export const removeBulkJournal  = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'delete',
      url: '/rest/journal/deletes',
      data: obj
    }
    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}