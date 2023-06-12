import Notiflix from 'notiflix';

import axiosClient from '../../axiosClient';
import { ErrorToast, SuccessToast } from '../../../components/Layouts/Alerts';

export const setCookiesClient = (cname, cvalue, exdays) => {
  const d = new Date();
  // Thoi gian ton tai
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};
export const getCookiesClient = (cname) => {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  if (decodedCookie) {
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
  }

  return '';
};
export const deleteCookieClient = (name) => {
  document.cookie = setCookiesClient(name, '', -1);
};

export const configHeadersAuthenticate = () => {
  const token = getCookiesClient('tokenClient');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const handleRegisterClientAPI = async (body) => {
  const response = await axiosClient.post('api/client/register', body);
  if (response.status === 200) {
    return 200;
  } else {
    return 403;
  }
};

export const handleLoginClientAPI = async (body) => {
  const url = 'api/client/login';
  const response = await axiosClient.post(url, body);
  if (response.status === 200) {
    return response;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 403;
  }
};
export const handleGetInformationClient = async () => {
  const response = await axiosClient.get('api/client/getme', configHeadersAuthenticate());
  if (response.status === 401) {
    return 401;
  } else if (response.status === 200) {
    return response.data;
  } else {
    return 500;
  }
};

export const logoutClient = async () => {
  const response = await axiosClient.post('api/client/logout', {}, configHeadersAuthenticate());
  const { status } = response;
  switch (status) {
    case 'success':
      SuccessToast('Đăng xuất thành công', 1000);
      return 200;
    case 401:
      Notiflix.Block.remove('.modal-content');
      return 401;
    default:
      ErrorToast(3500, 'Có lỗi. Vui lòng liên hệ quản trị viên');
      Notiflix.Block.remove('.modal-content');
      return 500;
  }
};

export const updateProfileClient = async (body) => {
  const url = `/api/client/profile`;
  const response = await axiosClient.put(url, body, configHeadersAuthenticate());
  if (response !== undefined) {
    if (response.status === 401) {
      return 401;
    } else if (response.status === 200) {
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
