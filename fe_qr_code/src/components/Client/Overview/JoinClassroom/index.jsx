import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BlockUICLIENT } from '../../../Layouts/Notiflix';
import Notiflix from 'notiflix';
import { useForm } from 'react-hook-form';
import { joinClassroomSchema } from '../../../../adapter/classroom';
import { joinClassroomClient } from '../../../../api/Client/Classroom/classroomClientAPI';
import { ErrorToast, SuccessToast } from '../../../Layouts/Alerts';
import Modal from '../../../Layouts/Modal';
import './style.css';

export default function JoinClassroom(props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(joinClassroomSchema),
    defaultValues: {
      classroom_code: '',
    },
  });
  const [backdrop, setBackdrop] = useState('static');
  const setStateModal = (value) => {
    props.setStateModal();
  };
  const handleGetAllClassroomClient = () => {
    props.handleGetAllClassroomClient();
  };
  const handleJoinClassroom = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    const result = await joinClassroomClient(data);
    if (result === 200) {
      SuccessToast('Tham gia lớp thành công', 3500);
      Notiflix.Block.remove('.sl-box');

      handleGetAllClassroomClient();
      setStateModal(false);
      reset();
    } else {
      ErrorToast('Thất bại ! Bạn không có trong danh sách lớp', 3500);
      Notiflix.Block.remove('.sl-box');
    }
    Notiflix.Block.remove('#root');
  };
  const renderBody = () => {
    return (
      <>
        <Form onSubmit={handleSubmit(handleJoinClassroom)} encType="multipart/form-data">
          <div className="row p-5">
            <div className="col md-6">
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Mã lớp</p>
                  <Form.Control type="text" maxLength={10} placeholder="Nhập mã lớp" {...register('classroom_code')} />
                  <small className="text-danger font-weight-bold">{errors?.classroom_code?.message}</small>
                </div>
              </Form.Group>
            </div>
          </div>
          <div className="row pb-2">
            <Form.Group className="d-flex justify-content-center">
              <Button type="submit" variant="info" className="me-3 font-weight-bold">
                Tham gia
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
    <>
      <Modal
        show={props.show}
        backdrop={backdrop}
        setStateModal={() => setStateModal()}
        elementModalTitle={<p>Tham gia lớp học</p>}
        elementModalBody={renderBody()}
      />
    </>
  );
}

JoinClassroom.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
};
