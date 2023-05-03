// @flow
import * as React from 'react';
import { Navigate } from 'react-router-dom';
import FormRegister from '../../../components/Client/Auth/Register';
import FormRegisterAdmin from '../../../components/Admin/Auth/Register';
import { checkLoginAdmin } from '../../../adapter/auth';

export function RegisterAdminPage() {
  const isLogin = checkLoginAdmin();
  return (
    <>
      {!isLogin ? (
        <section className="section-register">
          <div className="sl-box">
            <h4 className="mt-2 font-weight-bold text-center">Hệ thống điểm danh</h4>

            <h6 className="mt-2">
              Đăng ký vào&nbsp;<span className="font-weight-bold">tài khoản</span>
            </h6>

            <div className="mt-3">
              <FormRegisterAdmin />;
            </div>
          </div>
        </section>
      ) : (
        <Navigate to="/admin/" />
      )}
    </>
  );
}
