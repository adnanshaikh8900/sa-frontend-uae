import { CONTACT } from 'constants/types'
import {
  authApi
} from 'utils'

export const getContactList = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/contact/getContactList?name=${obj.name}&email=${obj.email}&contactType=${obj.contactType}&pageNo=${obj.pageNo}&pageSize=${obj.pageSize}`
    }

    return authApi(data).then(res => {
      dispatch({
        type: CONTACT.CONTACT_LIST,
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
      url: '/rest/contact/deletes',
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

export const getCurrencyList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/bank/getcurrenncy'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: CONTACT.CURRENCY_LIST,
          payload: res.data
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getCountryList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: 'rest/datalist/getcountry'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: CONTACT.COUNTRY_LIST,
          payload: res.data
        })
      }
    }).catch(err => {
      throw err
    })
  }
}

export const getContactTypeList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/rest/datalist/getContactTypes`
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: CONTACT.CONTACT_TYPE_LIST,
          payload: res.data
        })
      }
    }).catch(err => {
      throw err
    })
  }
}