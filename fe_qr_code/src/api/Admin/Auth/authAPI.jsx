import Notiflix from 'notiflix';

import axiosClient from '../../axiosClient';
import { ErrorToast, SuccessToast } from '../../../components/Layouts/Alerts';
import axiosAdmin from '../../axiosAdmin';

export const setCookiesAdmin = (cname, cvalue, exdays) => {
  const d = new Date();
  // Thoi gian ton tai
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
};
export const getCookiesAdmin = (cname) => {
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
export const deleteCookieAdmin = (name) => {
  document.cookie = setCookiesAdmin(name, '', -1);
};

export const configHeadersAuthenticate = () => {
  const token = getCookiesAdmin('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const handleRegisterAdminAPI = async (body) => {
  const response = await axiosClient.post('api/admin/register', body);
  if (response.status === 200) {
    return 200;
  } else {
    return 403;
  }
};

export const handleLoginAdminAPI = async (body) => {
  const url = 'api/admin/login';
  const response = await axiosClient.post(url, body);
  if (response.status === 200) {
    return response;
  } else if (response.status === 401) {
    return 401;
  } else {
    return 403;
  }
};
export const handleGetInformationAdmin = async () => {
  const response = await axiosClient.get('api/admin/getme', configHeadersAuthenticate());
  if (response.status === 401) {
    return 401;
  }
  if (response.status === 200) {
    return response.data;
  }
};

export const logoutAdmin = async () => {
  const response = await axiosClient.post('api/admin/logout', {}, configHeadersAuthenticate());
  const { status } = response;
  // console.log('dhgj', status);
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

// export const senMailOTPClient = async (body) => {
//   const response = await axiosClient.post('api/client/otp-sendmail', body);
//   if (response.status === 200) {
//     return 200;
//   } else if (response.status === 404) {
//     return 404;
//   } else if (response.status === 400) {
//     return 400;
//   }
// };

// export const forgotPasswordClient = async (body) => {
//   const response = await axiosClient.put('api/client/forgot-password', body);
//   if (response.status === 'success') {
//     return 200;
//   } else {
//     return 403;
//   }
// };

// export const editProfile = async (id, body) => {
//   const url = `/api/client/updateprofile/${id}`;
//   const response = await axiosClient.put(url, body, configHeadersAuthenticate());
//   if (response.status === 401) {
//     return 401;
//   } else if (response.status === 'success') {
//     return 200;
//   } else if (response.status === 500) {
//     return 500;
//   } else {
//     return 404;
//   }
// };

export const getDistanceFromLatLonInKm = async (body) => {
  const url = `/api/calculate-distance`;

  const response = await axiosClient.get('/api/calculate-distance', {
    params: body,
  });
  if (response.status === 'OK') {
    return response.routes[0].legs[0].distance;
  } else {
    return false;
  }
};
