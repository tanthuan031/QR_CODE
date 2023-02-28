import React, { useState } from 'react';
import { Modal as ModalBootstrap } from 'react-bootstrap';
import PropTypes from 'prop-types';

import './style.css';
import { FaTimes } from 'react-icons/fa';

export default function Modal(props) {
  const { elementModalBody, elementModalTitle, className, isHeader = true } = props;
  const [show, setShow] = useState(props.show);

  return (
    <ModalBootstrap
      show={props.show}
      onHide={() => {
        props.setStateModal();
      }}
      dialogClassName="modal-90w"
      centered
      backdrop={props.backdrop}
    >
      {isHeader && (
        <ModalBootstrap.Header closeButton className="">
          <h5 className="text-info font-weight-bold w-100 text-center">{elementModalTitle}</h5>
          <FaTimes onClick={() => !props.setStateModal()} className="cursor-pointer" />
        </ModalBootstrap.Header>
      )}

      <ModalBootstrap.Body className="pd-0">
        <div>{elementModalBody}</div>
      </ModalBootstrap.Body>
    </ModalBootstrap>
  );
}

Modal.propTypes = {
  elementModalBody: PropTypes.element,
  //   elementModalTitle: PropTypes.element,
  setStateModal: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  backdrop: PropTypes.any,
};
