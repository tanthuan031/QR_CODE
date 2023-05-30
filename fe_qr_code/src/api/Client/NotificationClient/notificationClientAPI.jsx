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

export const getAllNotificationsClient = async ({ sort, search, page, classCode } = {}) => {
  const url = '/api/client/notification';
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
  if (classCode) {
    queryString.push(`class-code=${classCode}`);
  }
  const final_url = concatQueryString(queryString, url);

  const response = await axiosClient.get(final_url, configHeadersAuthenticate());
  if (response !== undefined) {
    if (response.status === 401) {
      return 401;
    } else if (response.status === 'success') {
      return response;
    } else if (response.status === 400) {
      return 400;
    } else {
      return 404;
    }
  } else {
    return 500;
  }
};
