import { AUTH } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const sendVerificationEmail = (obj) => {
  return (dispatch) => {
    let data = {
      method: 'post',
      url: '/public/forgotPassword',
      data: obj
    }
    return api(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
