// @flow
import * as React from 'react';
import { Button, Container, Nav, Navbar, Offcanvas } from 'react-bootstrap';
import './style.css';
import { menu_client_item } from '../../../asset/data/menu_client_item';
import { useSelector } from 'react-redux';
import { getUserAdminSelector, getUserClientSelector } from '../../../redux/selectors/auth/auth.selector';
import ListGroup from '../ListGroup';
import LogoutClient from '../../Client/Auth/Logout';
import { menu_admin_item } from '../../../asset/data/menu_admin_item';
import LogoutAdmin from '../../Admin/Auth/Logout';
export default function HeaderAdmin(props) {
  const [isNavbarOpen, setIsNavbarOpen] = React.useState(false);
  const [showOffcanvas, setShowOffcanvas] = React.useState(false);
  const menu_admin_item_data = [...menu_admin_item];

  const [showLogout, setStateModalLogout] = React.useState(false);
  const user = useSelector(getUserAdminSelector);
  React.useEffect(() => {
    const handleResize = () => {
      setIsNavbarOpen(window.innerWidth >= 1024);
    };

    handleResize(); // Kiểm tra kích thước ban đầu khi load trang

    window.addEventListener('resize', handleResize); // Lắng nghe sự kiện resize của cửa sổ

    return () => {
      window.removeEventListener('resize', handleResize); // Hủy lắng nghe khi component unmount
    };
  }, []);

  const handleNavLinkClick = (e) => {
    // var offcanvasNavbarExpandSm = document.querySelector('.offcanvas.offcanvas-start.show');
    // var fadeOffcanvasBackdrop = document.querySelector('.offcanvas-backdrop.show');
    // var btn = document.querySelector('body');
    // document.body.style.overflow = '';
    // offcanvasNavbarExpandSm !== null && offcanvasNavbarExpandSm.classList.remove('show');
    // fadeOffcanvasBackdrop !== null && fadeOffcanvasBackdrop.classList.remove('show');
  };
  return (
    <div className="header">
      <Navbar bg="dark" variant="dark" expand={isNavbarOpen} className="navbar-custom">
        <Container fluid>
          <div>
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand-sm`}
              className="btn-toggle-custom"
              onClick={() => setShowOffcanvas(!showOffcanvas)}
            />
            <Navbar.Brand href="#" className="ml-3">
              SGU
            </Navbar.Brand>
          </div>
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-sm`}
            aria-labelledby={`offcanvasNavbarLabel-expand-sm11`}
            placement="start"
            show={showOffcanvas}
            onHide={() => setShowOffcanvas(false)}
          >
            <Offcanvas.Body>
              <aside id="drawer" className="drawer">
                <Container className="py-3">
                  <>
                    {/* <img src={Logo} alt="Logo" width="80" height="80" /> */}
                    <div
                      style={{
                        color: '#ffffff',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.3rem',
                      }}
                    >
                      {Object.keys(user).length !== 0 && user.data.last_name + ' ' + user.data.first_name}
                    </div>
                    <div
                      style={{
                        color: '#ffffff',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '.8rem',
                      }}
                    >
                      {Object.keys(user).length !== 0 && user.data.teacher_code}
                    </div>
                    <div className="py-3">
                      {
                        <ListGroup
                          data={menu_admin_item_data}
                          handleNavLinkClick={handleNavLinkClick}
                          setShowOffcanvas={setShowOffcanvas}
                        />
                      }
                    </div>
                    <div className="d-flex justify-content-center ">
                      <Button className="btn-primary" onClick={() => setStateModalLogout(true)} size="sm">
                        Logout
                      </Button>
                    </div>
                  </>
                </Container>
              </aside>
              <LogoutAdmin show={showLogout} setStateModal={() => setStateModalLogout(false)} />
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  );
}
