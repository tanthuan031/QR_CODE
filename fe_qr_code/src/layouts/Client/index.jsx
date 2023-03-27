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
import { menu_client_item } from '../../asset/data/menu_client_item';
// import { Button, Image } from 'react-bootstrap';
// import { useSelector } from 'react-redux';

// import ExpiredToken from '../../components/commons/Auth/ExpiredToken';
// import { exPiredTokenSelector, getUserSelector } from '../../redux/selectors';
// import Logout from '../../components/commons/Auth/Logout';
// import { useState } from 'react';
// import { menu_admin_item_storage } from '../../asset/data/menu_admin_storage_item';
// import Skeleton from '../../components/commons/Layouts/Skeleton';

export function ClientLayout(props) {
  const { slot } = props;
  const menu_admin_item_data = [...menu_client_item];
  // const menu_admin_item_storage_data = [...menu_admin_item_storage];
  // const expiredToken = useSelector(exPiredTokenSelector);
  // const [showLogout, setStateModalLogout] = useState(false);
  // const user = useSelector(getUserSelector);
  return (
    <>
      <Header />
      <Drawer
        slot={
          <>
            {/* <img src={Logo} alt="Logo" width="80" height="80" /> */}

            <div className="py-5">{<ListGroup data={menu_admin_item_data} />}</div>
            <div className="d-flex justify-content-center ">
              {/* <Button className="btn-danger" onClick={() => setStateModalLogout(true)}>
                Logout
              </Button> */}
            </div>
          </>
        }
      />
      <main id="main" className="main p-5">
        {slot}
      </main>
    </>
  );
}
ClientLayout.propTypes = {
  slot: PropTypes.element.isRequired,
};