import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ImageLogin from '../../../../utils/imagelogin.png';
import './style.css';
import { BlockUICLIENT } from '../../../Layouts/Notiflix';
import { handleLoginClientAPI, setCookiesClient } from '../../../../api/Client/Auth';
import { ErrorToast, SuccessToast } from '../../../Layouts/Alerts';
import Notiflix from 'notiflix';
import { setIsLoginClient } from '../../../../redux/reducer/auth/auth.reducer';

export default function FormLogin() {
  const historyLocation = useNavigate();
  const [typePassword, setShowPassword] = useState('password');
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    BlockUICLIENT('.section-root-login');
    const result = await handleLoginClientAPI(data);
    if (result === 403 || result === 422) {
      ErrorToast('Mã sinh viên hoặc mật khẩu không đúng', 3500);
      Notiflix.Block.remove('.section-root-login');
      return;
    }
    if (result.status === 401 || result === 401) {
      ErrorToast('Your account has been locked.', 3500);
      Notiflix.Block.remove('.section-root-login');
      return;
    }
    if (result.status === 200) {
      SuccessToast('Đăng nhập thành công', 2000);
      setCookiesClient('tokenClient', result.data, 1);
      dispatch(setIsLoginClient(true));
      Notiflix.Block.remove('.sl-box');
      Notiflix.Block.remove('.section-root-login');
      setTimeout(() => {
        window.location.href = '/';
        // console.log(historyLocation(-1));
        // historyLocation(-1);
      }, 1000);
      return;
    }
  };
  // const handleForgorPW = () => {
  //   dispatch(setIsForgotPasswordClient(true));
  // };
  return (
    <>
      <div className="row section-root-login">
        <div className="col-md-6 d-flex sl-box-image ">
          <div className="sl-box-image-content">
            <img src={ImageLogin} alt="" className="sl-box-image-item" />

            <h3 className="text-center">SGU</h3>
          </div>
        </div>
        <div className="col-md-6 d-flex ">
          <div className="sl-box-content">
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3 form-user">
                <Form.Label className="font-weight-bold">
                  Mã số sinh viên&nbsp;<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control {...register('student_code')} type="text" />
              </Form.Group>

              <Form.Group className="mb-2 form-password">
                <Form.Label className="font-weight-bold">
                  Mật khẩu&nbsp;<span className="text-danger">*</span>
                </Form.Label>
                <div className="fp-input">
                  <Form.Control {...register('password')} type={typePassword} />
                  {typePassword === 'text' ? (
                    <FaEye onClick={() => setShowPassword('password')} />
                  ) : (
                    <FaEyeSlash onClick={() => setShowPassword('text')} />
                  )}
                </div>
              </Form.Group>
              <Form.Group className="mb-3 text-end ">
                <span className="text-primary  text-end cursor-pointer ">Quên mật khâur ?</span>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  onClick={() => (historyLocation(-1) ? historyLocation(-1) : (window.location.href = '/'))}
                  className=" btn font-weight-bold btn-login-client margin-right-10px btn-secondary "
                >
                  Quay lại
                </Button>
                <Button className="font-weight-bold btn-login-client" type="submit" disabled={!isValid}>
                  Đăng nhập
                </Button>
              </div>
            </Form>
            <div className="text-center mt-5">
              <span>
                Bạn chưa có tài khoản ?
                <span className="text-primary cursor-pointer  ">
                  <Link to={'/register'}> Đăng ký</Link>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
