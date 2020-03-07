import { TEMP } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const getDetailedGeneralLedgerList = (postData) => {
  const { startDate, endDate} = postData
  return (dispatch) => {
    let data = {
      method: 'get',
      url: `/rest/detailedGeneralLedgerReport/getList?startDate=${startDate}&endDate=${endDate}`
    }
    return authApi(data).then(res => {
      if (res.status === 200) {
        // dispatch({
        //   type: EMPLOYEE.CURRENCY_LIST,
        //   payload: res
        // })
        return res
      }
    }).catch(err => {
      throw err
    })
  }
}

