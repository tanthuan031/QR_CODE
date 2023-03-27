// Check login authentication

import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// import { checkLogin } from '../../adapter/auth';
// import { checkLogin } from '../../api/Auth';

export function ClientProtectedRoutes(props) {
  const isAuthenticate = true; // checkLogin();
  // console.log('use', props.userRole.role_id);
  return isAuthenticate ? <Outlet /> : <Navigate to="login" />;
}