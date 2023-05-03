// @flow
import * as React from 'react';
import { Navigate } from 'react-router-dom';
import FormRegister from '../../../components/Client/Auth/Register';
import { checkLoginClient } from '../../../adapter/auth';

export function RegisterPage() {
  const isLogin = checkLoginClient();
  return (
    <>
      {!isLogin ? (
        <section className="register_root" style={{ height: '100vh' }}>
          <FormRegister />;
        </section>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}
