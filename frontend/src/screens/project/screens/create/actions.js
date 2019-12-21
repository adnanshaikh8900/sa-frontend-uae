import { PROJECT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

export const createAndSaveProject = (project) => {
  return (dispatch) => {
    let data = {
      method: 'POST',
      url: `/rest/project/saveproject`,
      data: project
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}
