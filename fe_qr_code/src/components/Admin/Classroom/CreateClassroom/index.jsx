import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import Modal from '../../../Layouts/Modal';
import * as XLSX from 'xlsx';
import './style.css';

export default function CreateClassroom(props) {
  const [backdrop, setBackdrop] = useState('static');
  const setStateModal = value => {
    props.setStateModal();
  };

  const [file, setFile] = useState(null);

  const handleFileUpload = event => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleCreateClassroom = e => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = event => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('ss', excelData);
    };
    reader.readAsArrayBuffer(file);
  };
  const renderBody = () => {
    return (
      <>
        <Form>
          <div className="row p-5">
            <div className="col md-6">
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Tên lớp</p>
                  <Form.Control />
                  <small className="text-danger font-weight-bold"></small>
                </div>
              </Form.Group>
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Số tuần điểm danh</p>
                  <Form.Control type="number" />
                </div>
              </Form.Group>
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Chọn danh sách lớp</p>
                  <Form.Control type="file" onChange={handleFileUpload} />
                </div>
              </Form.Group>
            </div>
          </div>
          <div className="row pb-2">
            <Form.Group className="d-flex justify-content-center">
              <Button type="submit" variant="info" className="me-3 font-weight-bold" onClick={handleCreateClassroom}>
                Tạo lớp
              </Button>
              <Button type="button" variant="secondary" className="font-weight-bold" onClick={() => setStateModal()}>
                Quay lại
              </Button>
            </Form.Group>
          </div>
        </Form>
      </>
    );
  };
  return (
    <Modal
      show={props.show}
      backdrop={backdrop}
      setStateModal={() => setStateModal()}
      elementModalTitle={<p>Tạo lớp học</p>}
      elementModalBody={renderBody()}
    />
  );
}

CreateClassroom.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
};
