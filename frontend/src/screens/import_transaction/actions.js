import { IMPORT_TRANSACTION } from 'constants/types'
import {
  api,
  authApi
} from 'utils'
import moment from 'moment'


export const getDateFormatList = () => {
  return (dispatch) => {
    let data = {
      method: 'get',
      url: '/rest/dateFormat/getList'
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        dispatch({
          type: IMPORT_TRANSACTION.DATE_FORMAT_LIST,
          payload: res.data
        })
      }
    }).catch(err => {
      throw err
    })
  }
}