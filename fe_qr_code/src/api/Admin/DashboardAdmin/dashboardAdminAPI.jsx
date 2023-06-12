import { concatQueryString } from '../../../utils/concatQueryString';
import { titleToSlug } from '../../../utils/titleToSlug';
import axiosClient from '../../axiosClient';
import { getCookiesAdmin } from '../Auth/authAPI';

export const configHeadersAuthenticate = () => {
  const token = getCookiesAdmin('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllTotalDashboardAdmin = async ({ sort, search, page, total } = {}) => {
  const url = '/api/admin/dashboard';
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
  if (total) {
    queryString.push(`query-total`);
  }
  const final_url = concatQueryString(queryString, url);

  const response = await axiosClient.get(final_url, configHeadersAuthenticate());
  if (response !== undefined) {
    if (response.status === 401) {
      return 401;
    } else if (response.status === 200) {
      return response;
    } else if (response.status === 403) {
      return 403;
    } else {
      return 404;
    }
  } else {
    return 500;
  }
};

export const getAttendanceRatio = async ({ sort, search, page, total } = {}) => {
  const url = '/api/admin/dashboard';
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
  if (total) {
    queryString.push(`query-total`);
  }
  const final_url = concatQueryString(queryString, url);

  const response = await axiosClient.get(final_url, configHeadersAuthenticate());
  if (response !== undefined) {
    if (response.status === 401) {
      return 401;
    } else if (response.status === 200) {
      return response;
    } else if (response.status === 403) {
      return 403;
    } else {
      return 404;
    }
  } else {
    return 500;
  }
};
