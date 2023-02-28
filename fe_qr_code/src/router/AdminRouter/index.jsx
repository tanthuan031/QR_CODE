import React, { useEffect } from 'react';
import { ProtectedRoutes } from '../ProtectedRouter';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '../../pages/Admin/LoginPage';
import { ClassroomPage } from '../../pages/Admin/ClassroomPage';
import { AdminLayout } from '../../layouts/Admin';
export default function AdminRouter() {
  return (
    <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/register" element={<div>Register</div>} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/admin/classroom" element={<AdminLayout slot={<ClassroomPage role={1} />} />} />
      </Route>
    </Routes>
  );
}
