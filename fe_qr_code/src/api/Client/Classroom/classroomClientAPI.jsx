import axios from 'axios';
import { concatQueryString } from '../../../utils/concatQueryString';
import { titleToSlug } from '../../../utils/titleToSlug';
import axiosClient from '../../axiosClient';
import { getCookiesClient } from '../Auth';

export const configHeadersAuthenticate = () => {
  const token = getCookiesClient('tokenClient');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllClassroomClient = async ({ sort, search, page } = {}) => {
  const url = '/api/client/classroom';
  const queryString = [];
  if (sort && sort.length > 0) {
    sort.forEach((item) => {
      queryString.push(`sort[${titleToSlug(item.key)}]=${item.value}`);
    });
  }
  if (search) {
    queryString.push(`search=${search}`);
  }
  if (page) {
    queryString.push(`page=${page}`);
  }
  const final_url = concatQueryString(queryString, url);

  const response = await axiosClient.get(final_url, configHeadersAuthenticate());
  if (response.status === 401) {
    return 401;
  } else if (response.status === 'success') {
    return response.data;
  } else {
    return 500;
  }
};

export const joinClassroomClient = async (body) => {
  const url = '/api/client/classroom';
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  if (response.status === 401) {
    return 401;
  } else if (response.status === 'success') {
    return 200;
  } else if (response.status === 500) {
    return 500;
  } else {
    return 404;
  }
};

export const detailClassroomStudentClient = async (id) => {
  const url = `/api/client/classroom/${id}`;
  const response = await axiosClient.get(url, configHeadersAuthenticate());
  if (response.status === 'success') {
    return response.data;
  } else if (response.status === 401) {
    return 401;
  } else {
    return {};
  }
};

// Attendance

export const attendanceStudentClient = async (body) => {
  const url = `/api/client/attendance`;
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  if (response.status === 'success') {
    return 200;
  } else if (response.status === 'fail') {
    return 403;
  } else if (response.status === 400) {
    return 400;
  } else if (response.status === 404) {
    return 404;
  } else if (response.status === 402) {
    return 402;
  } else if (response == 'Server error') {
    return 401;
  } else {
    return 401;
  }
};

// face verify

export const faceVerifyClient = async (body) => {
  const url = `/api/client/face_verify`;
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  if (response.status === 'success') {
    return 200;
  } else if (response.status === 'fail') {
    return 403;
  } else if (response.status === 404) {
    return 404;
  } else if (response == 'Server error') {
    return 401;
  } else {
    return 401;
  }
};

export const faceVerifyClientAPI = async (body) => {
  const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8004/api/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  try {
    const response = await axiosInstance.post('face-check', body, {
      params: {
        key: '12345678910',
      },
    });
    console.log('response', response);
    if (response.status === 200) {
      return {
        status: 200,
        data: response?.data?.data,
      };
    } else {
      return {
        status: 403,
        data: null,
      };
    }
  } catch (error) {
    // Xử lý lỗi ở đây nếu cần
    console.error('Error occurred:', error);
    return {
      status: 500,
      data: null,
    };
  }
};
