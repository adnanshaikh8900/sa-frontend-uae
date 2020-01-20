import { BANK_STATEMENT } from 'constants/types'
import {
  api,
  authApi,
  authFileUploadApi
} from 'utils'

export const getTemplateList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/transactionParsing/selectModelList',
    }
    return authApi(data).then(res => {
        return res
      }).catch(err => {
        throw err
      })
  }
}

export const parseFile = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/transactionimport/parse',
      data: obj
    }
    return authFileUploadApi(data).then(res => {
        return res
      }).catch(err => {
        throw err
      })
  }
}

export const importTransaction = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/rest/transactionimport/saveimporttransaction',
      data: obj
    }
    return authApi(data).then(res => {
        return res
      }).catch(err => {
        throw err
      })
  }
}