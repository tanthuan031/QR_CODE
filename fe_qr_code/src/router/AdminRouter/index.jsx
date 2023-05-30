import React, { useEffect } from 'react';
import { ProtectedRoutes } from '../ProtectedRouter';
import { Route, Routes } from 'react-router-dom';

import { ClassroomPage } from '../../pages/Admin/ClassroomPage';
import { AdminLayout } from '../../layouts/Admin';
import { OverviewPage } from '../../pages/Admin/Overview';
import { LoginAdminPage } from '../../pages/Common/AuthAdmin/LoginPage';
import { useDispatch } from 'react-redux';
import { handleGetMeAdmin } from '../../adapter/auth';
import { deleteCookieAdmin, getCookiesAdmin } from '../../api/Admin/Auth/authAPI';
import { setIsLoginAdmin, setUserAdmin } from '../../redux/reducer/auth/auth.reducer';
import { RegisterAdminPage } from '../../pages/Common/AuthAdmin/RegisterPage';
import { AdminHistoryPermissionPage } from '../../pages/Admin/HistoryAskPermission';
export default function AdminRouter() {
  const dispatch = useDispatch();
  useEffect(() => {
    handleGetMeAdmin().then((result) => {
      if (result === 401) {
        const token = getCookiesAdmin('token');
        dispatch(setIsLoginAdmin(false));
        if (token) {
          deleteCookieAdmin('token');
        }
      } else {
        // dispatch(setIsLoginClient(true));
        dispatch(setUserAdmin(result));
      }
    });
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginAdminPage />} />
      <Route path="/admin/register" element={<RegisterAdminPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin/classroom" element={<AdminLayout slot={<ClassroomPage role={1} />} />} />
        <Route path="/admin" element={<AdminLayout slot={<OverviewPage role={1} />} />} />
        <Route
          path="/admin/ask-for-permission"
          element={<AdminLayout slot={<AdminHistoryPermissionPage role={1} />} />}
        />
      </Route>
    </Routes>
  );
}
