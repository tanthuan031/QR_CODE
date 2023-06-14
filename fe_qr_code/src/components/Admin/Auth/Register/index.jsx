import { yupResolver } from '@hookform/resolvers/yup';
import Notiflix from 'notiflix';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { registerAdminSchema } from '../../../../adapter/auth';
import { handleRegisterAdminAPI } from '../../../../api/Admin/Auth/authAPI';
import { ErrorToast, SuccessToast } from '../../../Layouts/Alerts';
import { BlockUI } from '../../../Layouts/Notiflix';

export default function FormRegisterAdmin() {
  const [typePassword, setShowPassword] = useState('password');
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(registerAdminSchema),
  });

  const onSubmit = async (data) => {
    BlockUI('.sl-box');
    const resultData = {
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      email: data.email,
      teacher_code: data.teacher_code,
    };

    const result = await handleRegisterAdminAPI(resultData);
    if (result === 403 || result.status === 422) {
      ErrorToast('Mã giảng hoặc email đã được đăng ký . Vui lòng đăng nhập', 3500);
      Notiflix.Block.remove('.sl-box');

      return;
    } else if (result === 200) {
      SuccessToast('Đăng ký tài khoản thành công', 3000);
      // setCookies('token', result.data.token, 1);
      Notiflix.Block.remove('.sl-box');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1000);
      return;
    } else {
      ErrorToast('Đã có lỗi xảy ra vui lòng liên hệ quản trị viên', 3500);
      Notiflix.Block.remove('.sl-box');

      return;
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col col-md-6">
            <Form.Group className="mb-3 form-user">
              <Form.Label className="font-weight-bold">
                Tên giảng viên&nbsp;<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control {...register('first_name')} type="text" />
              <div className="d-flex justify-content-between">
                <small className="text-red font-12px">{errors?.first_name?.message}</small>
              </div>
            </Form.Group>
          </div>
          <div className="col col-md-6">
            <Form.Group className="mb-3 form-user">
              <Form.Label className="font-weight-bold">
                Họ và tên lót&nbsp;<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control {...register('last_name')} type="text" />
              <div className="d-flex justify-content-between">
                <small className="text-red font-12px">{errors?.last_name?.message}</small>
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row">
          <div className="col col-md-12">
            <Form.Group className="mb-3 form-user">
              <Form.Label className="font-weight-bold">
                Mã giảng viên&nbsp;<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control {...register('teacher_code')} type="text" />
              <div className="d-flex justify-content-between">
                <small className="text-red font-12px">{errors?.teacher_code?.message}</small>
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row">
          <div className="col col-md-12">
            <Form.Group className="mb-3 form-user">
              <Form.Label className="font-weight-bold">
                Email&nbsp;<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control {...register('email')} type="text" />
              <div className="d-flex justify-content-between">
                <small className="text-red font-12px">{errors?.email?.message}</small>
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row">
          <div className="col col-md-12">
            <Form.Group className="mb-2 form-password">
              <Form.Label className="font-weight-bold">
                Password&nbsp;<span className="text-danger">*</span>
              </Form.Label>
              <div className="fp-input">
                <Form.Control {...register('password')} type={typePassword} />
                {typePassword === 'text' ? (
                  <FaEye onClick={() => setShowPassword('password')} />
                ) : (
                  <FaEyeSlash onClick={() => setShowPassword('text')} />
                )}
              </div>
              <div className="d-flex justify-content-between">
                <small className="text-red font-12px">{errors?.password?.message}</small>
              </div>
            </Form.Group>
          </div>
        </div>
        <Form.Group className="mb-3 text-end ">
          <span className="text-danger font-weight-bold text-end cursor-pointer ">Quên mật khẩu ?</span>
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="danger" disabled={!isValid} className="font-weight-bold" type="submit">
            Đăng ký
          </Button>
        </div>
      </Form>
    </>
  );
}
