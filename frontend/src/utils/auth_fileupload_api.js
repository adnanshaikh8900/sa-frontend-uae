import axios from 'axios';
import config from 'constants/config';

const authFileUploadApi = axios.create({
  baseURL: config.API_ROOT_URL,
});

authFileUploadApi.interceptors.request.use(
  (config) => {
    console.log(config);
    config.headers.Authorization = `Bearer ${window['sessionStorage'].getItem(
      'accessToken',
    )}`;
    return config;
  },
  (error) => {
    return Promise.reject(error.response);
  },
);

authFileUploadApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      error.response.status &&
      error.response.status === 401
    ) {
      window['sessionStorage'].clear();
      window['location'] = '/login';
    } else {
      return Promise.reject(error.response);
    }
  },
);

export default authFileUploadApi;
