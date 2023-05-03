import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { loginAdminSchema } from '../../../../adapter/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { BlockUI } from '../../../Layouts/Notiflix';
import { handleLoginAdminAPI, setCookiesAdmin } from '../../../../api/Admin/Auth/authAPI';
import { ErrorToast, SuccessToast } from '../../../Layouts/Alerts';
import Notiflix from 'notiflix';

export default function FormLoginAdmin() {
  const [typePassword, setShowPassword] = useState('password');
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(loginAdminSchema),
  });

  const onSubmit = async (data) => {
    BlockUI('.sl-box');
    const result = await handleLoginAdminAPI(data);
    console.log(result);
    if (result === 403 || result === 422) {
      ErrorToast('Mã giảng viên hoặc mật khẩu không đúng', 3500);
      Notiflix.Block.remove('.sl-box');
      return;
    } else if (result === 401) {
      ErrorToast('Your account has been locked.', 3500);
      Notiflix.Block.remove('.sl-box');
      return;
    } else if (result.status === 200) {
      SuccessToast('Đăng nhập thành công', 2000);
      setCookiesAdmin('token', result.data, 1);
      window.location.href = '/admin/classroom';
      return;
    } else {
      ErrorToast('Có lỗi xảy ra. Vui lòng liên hệ quản trị viên', 3500);
      Notiflix.Block.remove('.sl-box');
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3 form-user">
          <Form.Label className="font-weight-bold">
            Mã giảng viên&nbsp;<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control {...register('teacher_code')} type="text" />
          <div className="d-flex justify-content-between">
            <small className="text-red font-12px">{errors?.teacher_code?.message}</small>
          </div>
        </Form.Group>

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
        <Form.Group className="mb-3 text-end ">
          <span className="text-danger font-weight-bold text-end cursor-pointer ">Quên mật khẩu ?</span>
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="danger" disabled={!isValid} className="font-weight-bold" type="submit">
            Đăng nhập
          </Button>
        </div>
      </Form>
    </>
  );
}
