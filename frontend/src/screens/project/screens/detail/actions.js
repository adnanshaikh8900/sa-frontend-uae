import { PROJECT } from 'constants/types'
import {
  api,
  authApi
} from 'utils'

// Get Project By ID
export const getProjectById = (id) => {
  return (dispatch) => {
    let data = {
      method: 'GET',
      url: `/rest/project/editproject?id=${id}`
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const deleteProject = (id) => {
  return (dispatch) => {
    let data = {
      method: 'DELETE',
      url: `/rest/project/deleteproject?id=${id}`
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}

export const updateProject = () => {
  return (dispatch) => {
    let data = {
      method: 'put',
      url: `/rest/project/update`
    }

    return authApi(data).then(res => {
      return res
    }).catch(err => {
      throw err
    })
  }
}