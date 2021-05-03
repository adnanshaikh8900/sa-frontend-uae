import {
  authApi
} from 'utils'

export const generateSalary = (obj) => {
  debugger
  return (dispatch) => {
    let data = {
      method: 'post',
      url: `/rest/Salary/generateSalary`,
      data: obj
    }
    return authApi(data).then((res) => {
      return res
    }).catch((err) => {
      throw err
    })
  }
}
