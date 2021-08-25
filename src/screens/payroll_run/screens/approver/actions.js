import {
  authApi
} from 'utils'

export const approveRunPayroll = (payrollId) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: `/rest/payroll/approveRunPayroll ?payrollId=${payrollId} `,
      // data: obj
    }
    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}
