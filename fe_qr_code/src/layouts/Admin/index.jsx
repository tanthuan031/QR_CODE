// @flow
import * as React from 'react';
// import Header from '../../components/commons/Layouts/Header';
import PropTypes from 'prop-types';
// import ListGroup from '../../components/commons/Layouts/ListGroup';
// import { menu_admin_item } from '../../asset/data/menu_admin_item';
import Drawer from '../../components/Layouts/Drawer';
import { menu_admin_item } from '../../asset/data/menu_admin_item';
import ListGroup from '../../components/Layouts/ListGroup';
import { Button } from 'react-bootstrap';
import Header from '../../components/Layouts/Header';
// import { FaUsers } from 'react-icons/fa';
import './style.css';
import LogoutAdmin from '../../components/Admin/Auth/Logout';
import { useState } from 'react';
import { getUserAdminSelector } from '../../redux/selectors/auth/auth.selector';
import { useSelector } from 'react-redux';
import HeaderAdmin from '../../components/Layouts/Header/index-admin';
// import { Button, Image } from 'react-bootstrap';
// import { useSelector } from 'react-redux';

// import ExpiredToken from '../../components/commons/Auth/ExpiredToken';
// import { exPiredTokenSelector, getUserSelector } from '../../redux/selectors';
// import Logout from '../../components/commons/Auth/Logout';
// import { useState } from 'react';
// import { menu_admin_item_storage } from '../../asset/data/menu_admin_storage_item';
// import Skeleton from '../../components/commons/Layouts/Skeleton';

export function AdminLayout(props) {
  const { slot } = props;
  const menu_admin_item_data = [...menu_admin_item];
  // const menu_admin_item_storage_data = [...menu_admin_item_storage];
  // const expiredToken = useSelector(exPiredTokenSelector);
  const [showLogout, setStateModalLogout] = useState(false);
  const user = useSelector(getUserAdminSelector);
  return (
    <>
      <HeaderAdmin />

      <main id="main-admin" className="main p-3">
        {slot}
      </main>
      <LogoutAdmin show={showLogout} setStateModal={() => setStateModalLogout(false)} />
    </>
  );
}
AdminLayout.propTypes = {
  slot: PropTypes.element.isRequired,
};
