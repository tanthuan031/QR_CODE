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

export const getAllHistoryAskPermission = async ({ sort, search, page } = {}) => {
  const url = '/api/admin/history-permission';
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
  if (response !== undefined) {
    if (response.status === 401) {
      return 401;
    } else if (response.status === 'success') {
      return response;
    } else {
      return 500;
    }
  } else {
    return 500;
  }
};

export const getAllDetailHistoryAskPermission = async ({ sort, search, page, classCode } = {}) => {
  const url = `/api/admin/history-permission`;
  const queryString = [];
  if (sort && sort.length > 0) {
    sort.forEach((item) => {
      queryString.push(`sort[${item.key}]=${item.value}`);
    });
  }
  if (search) {
    queryString.push(`search=${search}`);
  }
  if (classCode) {
    queryString.push(`detail-history=${classCode}`);
  }
  if (page) {
    queryString.push(`page=${page}`);
  }
  const final_url = concatQueryString(queryString, url);

  const response = await axiosClient.get(final_url, configHeadersAuthenticate());
  if (response !== undefined) {
    if (response.status === 401) {
      return 401;
    } else if (response.status === 'success') {
      return response;
    } else {
      return 500;
    }
  } else {
    return 500;
  }
};

export const updateAskPermissionAdmin = async (id, body) => {
  const url = `/api/admin/history-permission/${id}`;
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
