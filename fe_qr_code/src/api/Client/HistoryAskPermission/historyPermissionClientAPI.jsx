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

export const getAllHistoryAskPerClient = async ({ sort, search, page } = {}) => {
  const url = '/api/client/history-permission';
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

export const createAskPermissionClient = async (body) => {
  const url = '/api/client/history-permission';
  const response = await axiosClient.post(url, body, configHeadersAuthenticate());
  if (response.status === 401) {
    return 401;
  } else if (response.status === 'success') {
    return 200;
  } else if (response.status === 400) {
    return 400;
  } else {
    return 404;
  }
};

export const updateAskPermissionClient = async (id, body) => {
  const url = `/api/client/history-permission/${id}`;
  const response = await axiosClient.put(url, body, configHeadersAuthenticate());
  if (response !== undefined) {
    if (response.status === 401) {
      return 401;
    } else if (response.status === 'success') {
      return 200;
    } else if (response.status === 500) {
      return 500;
    } else if (response.status === 400) {
      return 400;
    } else {
      return 404;
    }
  } else {
    return 500;
  }
};

// export const detailClassroomStudentClient = async (id) => {
//   const url = `/api/client/classroom/${id}`;
//   const response = await axiosClient.get(url, configHeadersAuthenticate());
//   if (response.status === 'success') {
//     return response.data;
//   } else if (response.status === 401) {
//     return 401;
//   } else {
//     return {};
//   }
// };

// // Attendance

// export const attendanceStudentClient = async (body) => {
//   const url = `/api/client/attendance`;
//   const response = await axiosClient.post(url, body, configHeadersAuthenticate());
//   if (response.status === 'success') {
//     return 200;
//   } else if (response.status === 'fail') {
//     return 403;
//   } else if (response.status === 404) {
//     return 404;
//   } else if (response == 'Server error') {
//     return 401;
//   } else {
//     return 401;
//   }
// };

// // face verify

// export const faceVerifyClient = async (body) => {
//   const url = `/api/client/face_verify`;
//   const response = await axiosClient.post(url, body, configHeadersAuthenticate());
//   if (response.status === 'success') {
//     return 200;
//   } else if (response.status === 'fail') {
//     return 403;
//   } else if (response.status === 404) {
//     return 404;
//   } else if (response == 'Server error') {
//     return 401;
//   } else {
//     return 401;
//   }
// };
