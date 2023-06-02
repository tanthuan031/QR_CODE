import React, { useState } from 'react';
import { Button, Container, Navbar, Offcanvas } from 'react-bootstrap';
import PropTypes from 'prop-types';

import './style.css';

export default function Drawer(props) {
  const { slot } = props;
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Navbar bg="dark" expand={false} className="mb-3">
        <Container fluid expand={false}>
          <Navbar.Brand className="font-weight-black text-white pb-2 ml-3 logo" href="#">
            QR CODE
          </Navbar.Brand>
          {/* <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} className="order-lg-0 text-white " /> */}
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-md`} className="order-lg-0 text-white " />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-md`}
            aria-labelledby={`offcanvasNavbarLabel-expand-md`}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-md`}>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <aside id="drawer" className="drawer">
                <Container className="py-3">
                  <div>{slot}</div>
                </Container>
              </aside>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </>
  );
}

Drawer.propTypes = {
  slot: PropTypes.element.isRequired,
};
