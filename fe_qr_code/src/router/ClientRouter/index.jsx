import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ClientLayout } from '../../layouts/Client';
import { ClientOverviewPage } from '../../pages/Client/OverviewPage';
import { ClientProtectedRoutes } from '../ProtectedRouter/client';
import { LoginPage } from '../../pages/Common/Auth/LoginPage';
import { RegisterPage } from '../../pages/Common/Auth/RegisterPage';
import { useDispatch, useSelector } from 'react-redux';
import { handleGetMeClient } from '../../adapter/auth';
import { deleteCookieClient, getCookiesClient } from '../../api/Client/Auth';
import { setIsLoginClient, setUserClient } from '../../redux/reducer/auth/auth.reducer';
import { getUserClientSelector } from '../../redux/selectors';

export default function ClientRouter() {
  const dispatch = useDispatch();
  useEffect(() => {
    handleGetMeClient().then((result) => {
      if (result === 401) {
        const token = getCookiesClient('tokenClient');
        dispatch(setIsLoginClient(false));

        if (token) {
          deleteCookieClient('tokenClient');
        }
      } else {
        // dispatch(setIsLoginClient(true));
        dispatch(setUserClient(result));
      }
    });
  }, [dispatch]);
  const userInfo = useSelector(getUserClientSelector);
  console.log(userInfo);
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ClientProtectedRoutes />}>
        <Route path="/" element={<ClientLayout slot={<ClientOverviewPage role={1} />} />} />
      </Route>
    </Routes>
  );
}
