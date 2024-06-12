import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState, useRef } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Webcam from 'react-webcam';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
// import Select from 'react-select';
import ImageLogin from '../../../../utils/imagelogin.png';
import './style.css';
import Modal from '../../../Layouts/Modal';
import { registerClientSchema } from '../../../../adapter/auth';
import { handleRegisterClientAPI, handleRegisterFaceAPI } from '../../../../api/Client/Auth';
import { ErrorToast, SuccessToast } from '../../../Layouts/Alerts';
import Notiflix from 'notiflix';
import { BlockUICLIENT } from '../../../Layouts/Notiflix';
export default function FormRegister() {
  const backToPage = useNavigate();
  const [typePassword, setShowPassword] = useState('password');
  const [show, setShowCamera] = React.useState(false);
  const [backdrop, setBackdrop] = useState('static');
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(registerClientSchema),
  });
  const values = watch();
  const onSubmit = async (data) => {
    BlockUICLIENT('.register_root', 'fixed');
    const resultData = {
      first_name: data.first_name,
      last_name: data.last_name,
      password: data.password,
      email: data.email,
      student_code: data.student_code,
      image: data?.image,
    };
    const result = await handleRegisterClientAPI(resultData);
    if (result === 403 || result.status === 422) {
      ErrorToast('Mã sinh viên hoặc email đã được đăng ký . Vui lòng đăng nhập', 3500);
      Notiflix.Block.remove('.sl-box');
      Notiflix.Block.remove('.register_root');
      return;
    } else if (result === 200) {
      SuccessToast('Đăng ký tài khoản thành công', 3000);
      // setCookies('token', result.data.token, 1);
      Notiflix.Block.remove('.sl-box');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      return;
    } else {
      ErrorToast('Đã có lỗi xảy ra vui lòng liên hệ quản trị viên', 3500);
      Notiflix.Block.remove('.sl-box');
      Notiflix.Block.remove('.register_root');
      return;
    }
  };
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const captureImage = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      // Convert base64 to blob
      const byteString = atob(imageSrc.split(',')[1]);
      const mimeString = imageSrc.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // Create a File object from the Blob
      const file = new File([blob], 'webcam_capture.jpg', { type: mimeString });
      if (file) {
        console.log('file', file);
        const result = await handleRegisterFaceAPI({
          label: values?.student_code,
          descriptions: file,
        });
        if (result?.status === 200) {
          SuccessToast('Đăng ký khuôn mặt thành công', 3000);
          // setCookies('token', result.data.token, 1);
          Notiflix.Block.remove('.sl-box');
          setValue('image', result?.data?._id);
          setCapturedImage(imageSrc);
          setShowCamera(false);
        }
      }
    }
  };
  const renderBody = () => {
    return (
      <>
        <div>
          <div className="d-flex justify-content-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              // width={340}
              // height={300}
              className="video_qr"
            />
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
      <div className="row section-root-register">
        <div className="col-xl-5 col-md-6 d-flex sl-box-image ">
          <div className="sl-box-image-content">
            <img src={ImageLogin} alt="" className="sl-box-image-item" />

            <h3 className="text-center">SGU</h3>
          </div>
        </div>
        <div className="col-xl-7 col-md-6 d-flex ">
          <div className="sl-box-content">
            <Form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
              <div className="row">
                <h4 className="text-center mb-2 mt-2">Account Information</h4>
              </div>
              <div className="row">
                <div className="col-xl-6 col-md-12">
                  <Form.Group className="mb-2 form-user">
                    <Form.Label className="font-weight-bold">
                      Họ và tên lót&nbsp;<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control {...register('last_name')} type="text" />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <small className="text-red font-12px">{errors?.last_name?.message}</small>
                  </div>
                </div>
                <div className="col-xl-6 col-md-12">
                  <Form.Group className="mb-2 form-user">
                    <Form.Label className="font-weight-bold">
                      Tên của bạn&nbsp;<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control {...register('first_name')} type="text" />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <small className="text-red font-12px">{errors?.first_name?.message}</small>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group className="mb-2 form-user">
                    <Form.Label className="font-weight-bold">
                      MSSV&nbsp;<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control {...register('student_code')} type="text" />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <small className="text-red font-12px">{errors?.student_code?.message}</small>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group className="mb-2 form-password">
                    <Form.Label className="font-weight-bold">
                      Mật khẩu&nbsp;<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="fp-input">
                      <Form.Control {...register('password')} type={typePassword} />
                      {typePassword === 'text' ? (
                        <FaEye onClick={() => setShowPassword('password')} />
                      ) : (
                        <FaEyeSlash onClick={() => setShowPassword('text')} />
                      )}
                    </div>
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <small className="text-red font-12px">{errors?.password?.message}</small>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group className="mb-2 form-user">
                    <Form.Label className="font-weight-bold">
                      Email&nbsp;<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control {...register('email')} type="text" />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <small className="text-red font-12px">{errors?.email?.message}</small>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group className="mb-2 form-user">
                    <Form.Label className="font-weight-bold">
                      Khuôn mặt&nbsp;<span className="text-danger">*</span>
                    </Form.Label>
                    <Button className="btn-sm" onClick={() => setShowCamera(true)}>
                      Chụp khuôn mặt
                    </Button>

                    {/* {capturedImage && <img src={capturedImage} alt="Ảnh chụp" />} */}
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <small className="text-red font-12px">
                      {capturedImage == null && 'Bạn phải chụp khuôn mặt để đăng ký'}
                    </small>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Form.Group className="mb-2 form-user">
                    <Form.Label className="font-weight-bold">
                      Ảnh khuôn mặt&nbsp;<span className="text-danger">*</span>
                    </Form.Label>
                    <div className="img-capture">
                      {<Image src={capturedImage} alt="Ảnh chụp" className="img-capture-item" />}
                    </div>
                  </Form.Group>
                </div>
              </div>
              <div className="d-flex justify-content-center gap-2 mt-2">
                {/* <Button
                  variant="secondary"
                  className="font-weight-bold btn-login-client "
                  onClick={() => (backToPage(-1) ? backToPage(-1) : (window.location.href = '/'))}
                >
                  Cancel
                </Button> */}
                <Button
                  variant="primary"
                  className="font-weight-bold btn-login-client "
                  type="submit"
                  disabled={isValid == true && capturedImage !== null ? false : true}
                >
                  Register
                </Button>
              </div>
              <div className="text-center mt-3 ">
                <span>
                  Do you already have an account ?
                  <span className="text-primary cursor-pointer">
                    <Link to={'/login'}> Login</Link>
                  </span>
                </span>
              </div>
            </Form>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        backdrop={backdrop}
        setStateModal={() => setShowCamera(false)}
        elementModalTitle={<p>Khuôn mặt của bạn</p>}
        elementModalBody={renderBody()}
      />
    </>
  );
}
