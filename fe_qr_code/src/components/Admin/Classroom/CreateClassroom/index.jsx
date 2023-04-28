import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import Modal from '../../../Layouts/Modal';
import * as XLSX from 'xlsx';
import './style.css';
import { useForm } from 'react-hook-form';
import { addSchema } from '../../../../adapter/classroom';
import { FaRegQuestionCircle } from 'react-icons/fa';
import { addClassroom } from '../../../../api/Admin/Classroom/classroomAPI';

export default function CreateClassroom(props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(addSchema),
    defaultValues: {
      class_name: '',
      number_roll_call: '',
      number_lesson_week: '',
    },
  });
  const [backdrop, setBackdrop] = useState('static');
  const setStateModal = (value) => {
    props.setStateModal();
  };

  const [excelData, setExcelData] = useState([]);
  const [checkFileImport, setCheckFileImport] = useState(true);
  const [validateFileImport, setValidateFileImport] = useState();
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file.name.endsWith('.xlsx')) {
      setValidateFileImport('');
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setExcelData(excelData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setExcelData([]);
      setValidateFileImport('Định dạng file không hợp lệ (.xlsx)  hoặc trống');
    }
  };

  const handleCreateClassroom = async (data) => {
    const filterList = excelData.filter((record) => {
      return record.some((cell) => !!cell);
    });
    const dataListClass = filterList.map((row) => [row[1], row[2], row[3]]);
    if (checkFileImport == false && dataListClass.length == 0) {
      setValidateFileImport('Định dạng file không hợp lệ (.xlsx)  hoặc trống');
    }
    const resultDataList = dataListClass.slice(1).map(([student_code, last_name, first_name]) => ({
      student_code,
      last_name,
      first_name,
    }));
    const dataCreate = {
      class_name: data.class_name,
      number_roll_call: data.number_roll_call,
      teacher_code: 1,
      number_lesson_week: data.number_lesson_week,
      detail_classroom: resultDataList,
    };

    const result = await addClassroom(dataCreate);
    if (result === 200) {
      console.log('Tao thanh cong');
    } else if (result === 404) {
      alert('That bai');
    } else if (result === 401) {
      alert('That bai');
    } else {
      alert('that bai');
    }
  };
  const renderBody = () => {
    return (
      <>
        <Form onSubmit={handleSubmit(handleCreateClassroom)} encType="multipart/form-data">
          <div className="row p-5">
            <div className="col md-6">
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Tên lớp</p>
                  <Form.Control type="text" maxLength={128} {...register('class_name')} />
                  <small className="text-danger font-weight-bold">{errors?.class_name?.message}</small>
                </div>
              </Form.Group>
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Số tuần điểm danh</p>
                  <Form.Control type="number" min={1} max={20} {...register('number_roll_call')} />
                  <small className="text-danger font-weight-bold">{errors?.number_roll_call?.message}</small>
                </div>
              </Form.Group>
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Số tiết trong tuần</p>
                  <Form.Control type="number" min={1} max={5} {...register('number_lesson_week')} />
                  <small className="text-danger font-weight-bold">{errors?.number_lesson_week?.message}</small>
                </div>
              </Form.Group>
              <Form.Group className=" mb-3">
                <div className="cp-input d-flex">
                  <Form.Check
                    type="switch"
                    className="primary"
                    label="Import danh sách lớp"
                    onChange={() => setCheckFileImport(!checkFileImport)}
                  />
                  <div
                    className="padding-left-12px"
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Bạn cần chuẩn bị danh sách lớp bằng file excel để thêm vào lớp học"
                  >
                    <FaRegQuestionCircle fontSize="0.9rem" />
                  </div>
                </div>
              </Form.Group>
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <div className="d-flex">
                    <p className="font-weight-bold">Chọn danh sách lớp</p>
                    <div
                      className="padding-left-12px"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="File excel cần định dạng như sau : STT - Mã sinh viên - Họ lót - Tên "
                    >
                      <FaRegQuestionCircle fontSize="0.9rem" />
                    </div>
                  </div>
                  <Form.Control type="file" onChange={handleFileUpload} disabled={checkFileImport} />
                  <small className="text-danger font-weight-bold">{validateFileImport}</small>
                </div>
              </Form.Group>
            </div>
          </div>
          <div className="row pb-2">
            <Form.Group className="d-flex justify-content-center">
              <Button type="submit" variant="info" className="me-3 font-weight-bold">
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
