import axios from 'axios';
import { URL_SERVER } from '../utils/urlPath';
import queryString from 'query-string';
const axiosClient = axios.create({
  baseURL: URL_SERVER,
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  },
  paramsSerializer: {
    // encode: parse,
    serialize: (params) => queryString.stringify(params),
  },

  // withCredentials: true,
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    switch (error.response.status) {
      case 500:
        console.log('Server error');
        break;
      default:
        console.log('Something went wrong');
        console.log('--------------------');
        console.log(`URL: ${error.response.config.url}`);
        console.log(`HTTP Code: ${error.response.status}`);
        console.log(`HTTP Message: ${error.response.statusText}`);
        console.log('-------------------- ');
        return error.response;
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
