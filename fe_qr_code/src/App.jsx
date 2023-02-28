import React from 'react';

import AdminRouter from './router/AdminRouter';
export default function App() {
  // const location = useLocation();
  // const checkLayoutClient = location.pathname.split('/')[1] === 'admin' ? false : true;
  return (
    <>
      <AdminRouter />
    </>
  );
}
