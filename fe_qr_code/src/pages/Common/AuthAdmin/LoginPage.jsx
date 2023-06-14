// @flow
import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { checkLoginAdmin } from '../../../adapter/auth';
import FormLoginAdmin from '../../../components/Admin/Auth/Login';
import './style.css';
export function LoginAdminPage() {
  const isLogin = checkLoginAdmin();
  return (
    <>
      {!isLogin ? (
        <section className="section-login">
          <div className="sl-box">
            <h4 className="mt-2 font-weight-bold text-center">Hệ thống điểm danh</h4>

            <h6 className="mt-2">
              Đăng nhập vào&nbsp;<span className="font-weight-bold">tài khoản</span>
            </h6>

            <div className="mt-3">
              <FormLoginAdmin />
            </div>
          </div>
        </section>
      ) : (
        <Navigate to="/admin/" />
      )}
    </>
  );
}
