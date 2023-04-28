import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { ClientLayout } from '../../layouts/Client';
import { LoginPage } from '../../pages/Admin/LoginPage';
import { ClientOverviewPage } from '../../pages/Client/OverviewPage';
import { ClientProtectedRoutes } from '../ProtectedRouter/client';
export default function ClientRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<div>Register</div>} />
      <Route element={<ClientProtectedRoutes />}>
        <Route path="/" element={<ClientLayout slot={<ClientOverviewPage role={1} />} />} />
      </Route>
    </Routes>
  );
}
