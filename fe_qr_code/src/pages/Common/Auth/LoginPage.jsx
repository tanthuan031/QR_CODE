// @flow
import * as React from 'react';
import FormLogin from '../../../components/Client/Auth/Login';
import { checkLoginClient } from '../../../adapter/auth';
import { Navigate } from 'react-router-dom';
// import './style.css';
export function LoginPage() {
  const isLogin = checkLoginClient();
  return (
    <>
      {!isLogin ? (
        <section>
          <div className="mt-3">
            {/* {isForgotPasswordClient ? (
              isForgotPasswordVerifiedClient ? (
                <FormNewPasswordClient />
              ) : (
                <FormForgotPWClient />
              )
            ) : ( */}
            <FormLogin />
            {/* )} */}
          </div>
        </section>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}
