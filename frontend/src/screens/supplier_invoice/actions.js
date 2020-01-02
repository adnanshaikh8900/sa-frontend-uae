import { SUPPLIER_INVOICE } from 'constants/types'
import {
  api,
  authApi
} from 'utils'
import moment from 'moment'


export const getSupplierInoviceList = (postObj) => {
  let supplierName = postObj ? postObj.supplierName : ''
  let referenceNumber =  postObj ? postObj.referenceNumber : ''
  let invoiceDate =  postObj.invoiceDate
  let invoiceDueDate =  postObj.invoiceDueDate
  let amount =  postObj ? postObj.amount : ''
  let status =  postObj ? postObj.status : ''
  let contactType = postObj ? postObj.contactType : ''
  return (dispatch) => {
    let param = `rest/invoice/getList?type=${contactType}`
    if(invoiceDate) {
      let date = moment(invoiceDate).format('DD-MM-YYYY')
      param = param +`&invoiceDate=${date}`
    }
    if(invoiceDueDate) {
      let date = moment(invoiceDueDate).format('DD-MM-YYYY')
      param = param + `&invoiceDueDate=${date}`
    }
    let data ={
      method: 'get',
      url: param
      // data: postObj
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: SUPPLIER_INVOICE.SUPPLIER_INVOICE_LIST,
          payload: {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}


export const getProjectList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/project/getProjectsForDropdown'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: SUPPLIER_INVOICE.PROJECT_LIST,
          payload:  {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}
 

export const getContactList = (nameCode) => {
  let contactType = nameCode ? nameCode : ""
  return (dispatch) => {
    let data = {
      method: 'get', 
      url: `rest/contact/getContactsForDropdown?contactType=${contactType}`
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: SUPPLIER_INVOICE.CONTACT_LIST,
          payload:  {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}


export const getStatusList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/datalist/getInvoiceStatusTypes'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: SUPPLIER_INVOICE.STATUS_LIST,
          payload: res
        })
      }
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
          type: SUPPLIER_INVOICE.CURRENCY_LIST,
          payload:  {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}


export const getVatList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/vat/getvat'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: SUPPLIER_INVOICE.VAT_LIST,
          payload:  {
            data: res.data
          }
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getSupplierList = (id) => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/rest/contact/getContactsForDropdown?contactType=${id}`
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: SUPPLIER_INVOICE.SUPPLIER_LIST,
          payload: res
        })
      }
    }).catch(err => {
      throw err
    })
  }
}
export const createSupplier = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: 'rest/contact/save',
      data: obj
    }
    return authApi(data).then(res => {
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
      url: '/rest/supplierinvoice/deletes',
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