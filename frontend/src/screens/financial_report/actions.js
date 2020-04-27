import {
  authApi
} from 'utils'

export const getProfitAndLossReport = (postData) => {
  const { startDate, endDate} = postData
  let url = `rest/financialReport/profitandloss?startDate=${startDate}&endDate=${endDate}`

  return (dispatch) => {
    let data = {
      method: 'get',
      url
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