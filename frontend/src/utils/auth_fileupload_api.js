import axios from 'axios'
import config from 'constants/config'

const authFileUploadApi = axios.create({
  baseURL: config.API_ROOT_URL,
})

authFileUploadApi.interceptors.request.use(
  config => {
    config.headers.Authorization = `Bearer ${window.localStorage.getItem('accessToken')}`
    return config
  },
  error => {
    return Promise.reject(error.response)
  },
)

authFileUploadApi.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error.response)
  },
)

export default authFileUploadApi
