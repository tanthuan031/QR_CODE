import { concatQueryString } from '../../../utils/concatQueryString';
import { titleToSlug } from '../../../utils/titleToSlug';
import axiosClient from '../../axiosClient';

// export const configHeadersAuthenticate = () => {
//   const token = getCookies('token');
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   };
// };

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

  const response = await axiosClient.get(final_url);
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
  const response = await axiosClient.post(url, body);
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
  const response = await axiosClient.get(url);
  if (response.status === 'success') {
    return response.data;
  } else if (response.status === 401) {
    return 401;
  } else {
    return {};
  }
};
