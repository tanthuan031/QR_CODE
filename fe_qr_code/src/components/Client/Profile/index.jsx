// @flow
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import ImgBgr from '../../../asset/img/bgrprofile.png';
import ImgUserDefault from '../../../asset/img/employee_male.png';
import { getUserClientSelector } from '../../../redux/selectors/auth/auth.selector';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { registerClientSchema, updateProfileClientSchema } from '../../../adapter/auth';
import { BlockUICLIENT } from '../../Layouts/Notiflix';

import { FaEdit, FaEye, FaEyeSlash, FaUndo } from 'react-icons/fa';
import { Button, Form, Image } from 'react-bootstrap';
import Modal from '../../Layouts/Modal';
import Webcam from 'react-webcam';
import { updateProfileClient } from '../../../api/Client/Auth';
import Notiflix from 'notiflix';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
export function ClientProfile(props) {
  const dispatch = useDispatch();
  const user = useSelector(getUserClientSelector);
  const backToPage = useNavigate();
  const [typePassword, setShowPassword] = React.useState('password');
  const [show, setShowCamera] = React.useState(false);
  const [backdrop, setBackdrop] = React.useState('static');
  const [edit, setEdit] = React.useState(true);
  const webcamRef = React.useRef(null);
  const [capturedImage, setCapturedImage] = React.useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(updateProfileClientSchema),
  });
  React.useEffect(() => {
    if (Object.keys(user).length > 0) {
      reset({
        student_code: user.data.student_code,
        first_name: user.data.first_name,
        last_name: user.data.last_name,
        password: user.data.password,
        email: user.data.email,
      });
    }
  }, [user, dispatch]);
  const onSubmit = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    const resultData = {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      image: capturedImage !== null ? capturedImage : undefined,
    };
    const result = await updateProfileClient(resultData);
    if (result === 403 || result.status === 422) {
      ErrorToast('Có lỗi xảy ra . Vui lòng thử lại', 3500);
      Notiflix.Block.remove('.sl-box');
      Notiflix.Block.remove('#root');
    } else if (result === 200) {
      SuccessToast('Cập nhật hồ sơ thành công', 3000);
      Notiflix.Block.remove('.sl-box');
      Notiflix.Block.remove('#root');
    } else {
      ErrorToast('Đã có lỗi xảy ra vui lòng liên hệ quản trị viên', 3500);
      Notiflix.Block.remove('.sl-box');
      Notiflix.Block.remove('#root');
    }
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
  };
  const renderBody = () => {
    return (
      <>
        <div>
          <div className="d-flex justify-content-center">
            <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={340} height={300} />
          </div>
          <div className="d-flex justify-content-center mb-3">
            <Button onClick={captureImage}>Chụp ảnh</Button>
          </div>
        </div>
      </>
    );
  };
  return (
    <>
      <div className="row mb-6" style={{ margin: '0 auto' }}>
        <div className="col-xl-4 col-sm-6 col-12 mb-4 cursor-pointer">
          <div className="profile-card text-center shadow">
            <img className="img-fluid rounded-bottom rounded-3" src={ImgBgr} />
            <div className="profile-info">
              <img
                className="profile-pic  border-radius-lg shadow-sm"
                style={{ objectFit: 'fill' }}
                id="wizardPicturePreview"
                src={Object.keys(user).length > 0 ? user.data.image : ImgUserDefault}
                width={100}
                height={100}
              />

              <h5 className="hvr-underline-from-center mt-4">
                {Object.keys(user).length > 0 && user.data.last_name + ' ' + user.data.first_name}
              </h5>
              <h6>
                <span>{Object.keys(user).length > 0 && user.data.email}</span>
              </h6>
              <h5 className="mt-0">{Object.keys(user).length > 0 && user.data.student_code}</h5>
            </div>
            <p>
              <i className="ni ni-building"></i> SGU Trường đại học Sài Gòn
            </p>
            <p>
              <i className="ni ni-briefcase-24"></i> Khoa công nghệ thông tin
            </p>
          </div>
        </div>
        <div className="col-xl-8 col-sm-6 col-12 mb-4 cursor-pointer">
          <div className="profile-card  shadow">
            <h4 className="text-center pt-3">Thông tin người dùng</h4>
            <div className="text-end padding-right-30px " onClick={() => setEdit(!edit)}>
              {edit === true ? <FaEdit className="text-warning" /> : <FaUndo className="text-info" />}
            </div>
            <div className="sl-box-content">
              <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-2 form-user">
                      <Form.Label className="font-weight-bold">
                        MSSV&nbsp;<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control {...register('student_code')} type="text" disabled />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <small className="text-red font-12px">{errors?.student_code?.message}</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-2 form-user">
                      <Form.Label className="font-weight-bold">
                        Email&nbsp;<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control {...register('email')} type="text" disabled={edit} />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <small className="text-red font-12px">{errors?.email?.message}</small>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-2 form-user">
                      <Form.Label className="font-weight-bold">
                        Họ và tên lót&nbsp;<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control {...register('last_name')} type="text" disabled={edit} />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <small className="text-red font-12px">{errors?.last_name?.message}</small>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-2 form-user">
                      <Form.Label className="font-weight-bold">
                        Tên của bạn&nbsp;<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control {...register('first_name')} type="text" disabled={edit} />
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                      <small className="text-red font-12px">{errors?.first_name?.message}</small>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center  gap-2 mt-5">
                  <Button
                    variant="outline-primary"
                    className="btn-sm font-weight-bold btn-login-client "
                    type="submit"
                    disabled={edit}
                  >
                    Cập nhật
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        backdrop={backdrop}
        setStateModal={() => setShowCamera(false)}
        elementModalTitle={<p>Cập nhật khuôn mặt của bạn</p>}
        elementModalBody={renderBody()}
      />
    </>
  );
}
