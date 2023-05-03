// Check login authentication

import * as React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { checkLoginAdmin } from '../../adapter/auth';
// import { checkLogin } from '../../adapter/auth';
// import { checkLogin } from '../../api/Auth';

export function ProtectedRoutes(props) {
  const isAuthenticate = checkLoginAdmin();
  // console.log('use', props.userRole.role_id);
  return isAuthenticate ? <Outlet /> : <Navigate to="admin/login" />;
}
