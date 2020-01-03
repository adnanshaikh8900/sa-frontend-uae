import { RECEIPT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

import moment from 'moment'

export const getReceiptList = (obj) => {
  let receiptDate = obj.receiptDate;
  let url = `/rest/receipt/getList?receiptReferenceCode=${obj.receiptReferenceCode}&contactId=${obj.contactId}&invoiceId=${obj.invoiceId}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`;
  if (receiptDate) {
    let date = moment(receiptDate).format('DD-MM-YYYY')
    url = url + `&receiptDate=${date}`
  }
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: url
    }
    return authApi(data).then(res => {
      dispatch({
        type: RECEIPT.RECEIPT_LIST,
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
      url: '/rest/receipt/deletes',
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

export const getContactList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/contact/getContactsForDropdown'
    }

    return authApi(data).then(res => {
      dispatch({
        type: RECEIPT.CONTACT_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}
export const getInvoiceList = () => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: '/rest/invoice/getInvoicesForDropdown'
    }

    return authApi(data).then(res => {
      dispatch({
        type: RECEIPT.INVOICE_LIST,
        payload: res.data
      })
      return res
    }).catch(err => {
      throw err
    })
  }
}