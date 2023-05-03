import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setExpiredToken, setIsLoginAdmin, setUserAdmin } from '../../../../redux/reducer/auth/auth.reducer';
import Modal from '../../../Layouts/Modal';
import { deleteCookieAdmin, getCookiesAdmin, logoutAdmin } from '../../../../api/Admin/Auth/authAPI';

export default function LogoutAdmin(props) {
  const [backdrop, setBackdrop] = useState('static');

  const dispatch = useDispatch();

  const handleLogout = async () => {
    setBackdrop('static');
    const response = await logoutAdmin();
    if (response === 500) {
      setBackdrop('static');
    }
    if (response === 401) {
      props.setStateModal();
      // handleSetUnthorization();
    }
    if (response === 200) {
      const token = getCookiesAdmin('token');
      dispatch(setIsLoginAdmin(false));
      dispatch(setUserAdmin({}));
      if (token) {
        deleteCookieAdmin('token');
      }
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1000);
    }
  };
  // const handleSetUnthorization = () => {
  //   dispatch(setExpiredToken(true));
  //   const token = getCookies('token');
  //   // dispatch(setIsLogin(false));
  //   dispatch(setExpiredToken(true));
  //   if (token) {
  //     deleteCookie('token');
  //   }
  // };
  return (
    <Modal
      show={props.show}
      backdrop={backdrop}
      setStateModal={() => props.setStateModal()}
      elementModalTitle={<p>Thông báo</p>}
      elementModalBody={
        <div className="p-3">
          <h6 className="mb-3">Bạn muốn đăng xuất?</h6>
          <div className="d-flex align-items-center justify-content-end">
            <Button type="submit" variant="primary" className="me-3 font-weight-bold" onClick={() => handleLogout()}>
              Đăng xuất
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="font-weight-bold"
              onClick={() => props.setStateModal()}
            >
              Hủy
            </Button>
          </div>
        </div>
      }
    />
  );
}

LogoutAdmin.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
};
