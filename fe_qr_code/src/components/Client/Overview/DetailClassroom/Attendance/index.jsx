import React, { useEffect, useRef, useState } from 'react';
import { useZxing } from 'react-zxing';

import { Button, Form } from 'react-bootstrap';
import {
  setDataDetailClassroomClient,
  setIsAttendanceClient,
  setIsDetailClassroomClient,
  setIsScanQR,
} from '../../../../../redux/reducer/classroom/classroom.reducer';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../../../Layouts/Modal';
import { Modal as ModalConfirm } from 'antd';
import { ErrorToast, SuccessToast } from '../../../../Layouts/Alerts';
import {
  dataAttendanceClientSelector,
  dataDetailClassroomClientSelector,
  isDetailClassroomClientSelector,
} from '../../../../../redux/selectors/classroom/classroom.selector';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getDistanceFromLatLonInKm } from '../../../../../api/Admin/Auth/authAPI';
import Notiflix from 'notiflix';
import { BlockUICLIENT } from '../../../../Layouts/Notiflix';
import {
  attendanceStudentClient,
  detailClassroomStudentClient,
  faceVerifyClient,
} from '../../../../../api/Client/Classroom/classroomClientAPI';
import './style.css';
import Webcam from 'react-webcam';
const Attendance = () => {
  const dispatch = useDispatch();
  const [result, setResult] = useState('');
  const [resultAtt, setResultAtt] = useState();
  const [showAttendance, setShowAttendance] = useState(false);
  const [backdrop, setBackdrop] = useState('static');
  let countStep = 0;
  const detailClassroomClient = useSelector(isDetailClassroomClientSelector);
  const dataDetail = useSelector(dataDetailClassroomClientSelector);
  const dataAttendance = useSelector(dataAttendanceClientSelector);
  const cancelScanQR = () => {
    dispatch(setIsScanQR(false));
    dispatch(setIsAttendanceClient(false));
    dispatch(
      setIsDetailClassroomClient({
        ...detailClassroomClient,
        checkDetail: true,
      })
    );
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm();

  const handleDetailClassroom = async (idClassroom) => {
    const result = await detailClassroomStudentClient(idClassroom);
    if (result === 401) {
      return false;
    } else if (result === 500) {
      return false;
    } else {
      cancelScanQR();
      dispatch(
        setDataDetailClassroomClient({
          ...dataDetail,
          data: result,
        })
      );
    }
  };
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    // setShowCamera(false);
  };

  const handleAttendanceClassroom = async (data) => {
    const imageSrc = webcamRef.current.getScreenshot();
    const location = {
      lat1: dataAttendance.dataLocation.latitude,
      lon1: dataAttendance.dataLocation.longitude,
      lat2: dataAttendance.dataAttendance.location.latitude,
      lon2: dataAttendance.dataAttendance.location.longitude,
    };
    const formatData = {
      attendance_range: dataAttendance.dataAttendance.attendance_range,
      attendance_time: dataAttendance.dataAttendance.attendance_time,
      attendance_week: dataAttendance.dataAttendance.attendance_week,
      attendance_lesson: dataAttendance.dataAttendance.attendance_lesson,
      classroom_id: dataAttendance.dataAttendance.id_classroom,
      create_at: dataAttendance.dataAttendance.create_at,
      key_value: btoa(dataAttendance.dataAttendance.tokensAdmin),
    };
    if (formatData) {
      const checkKm = await getDistanceFromLatLonInKm(location);
      if (checkKm.value <= Number(dataAttendance.dataAttendance.attendance_range) * 1000) {
        BlockUICLIENT('#root', 'fixed');
        setShowAttendance(false);
        const verifyFace = await faceVerifyClient({ imageVeryfile: imageSrc });
        if (verifyFace === 200) {
          const result = await attendanceStudentClient(formatData);
          if (result === 200) {
            SuccessToast('Điểm danh thành công', 3500);
            Notiflix.Block.remove('.sl-box');
            handleDetailClassroom(dataAttendance.dataAttendance.id_classroom);
            Notiflix.Block.remove('#root');
          } else if (result === 403) {
            setShowAttendance(false);
            Notiflix.Block.remove('#root');
            Notiflix.Block.remove('.sl-box');
            ModalConfirm.confirm({
              title: 'Cảnh báo',
              icon: '',
              content: `Thất bại! Hết thời gian điểm danh. Vui lòng liên hệ giảng viên để điểm danh lại`,
              // okText: 'Thử lại',
              // // cancelText: 'Đóng',
              onOk: () => {
                cancelScanQR();
              },
              // okButtonProps: {
              //   style: {
              //     backgroundColor: '#ff4d4f',
              //   },
              // },
              centered: true,
            });
          } else if (result === 404) {
            setShowAttendance(false);
            Notiflix.Block.remove('#root');
            Notiflix.Block.remove('.sl-box');
            ModalConfirm.confirm({
              title: 'Cảnh báo',
              icon: '',
              content: `Thất bại!Bạn không có trong lớp học`,
              // okText: 'Thử lại',
              // cancelText: 'Đóng',
              // onOk: () => {
              //   Notiflix.Block.remove('.sl-box');
              // },
              // okButtonProps: {
              //   style: {
              //     backgroundColor: '#ff4d4f',
              //   },
              // },
              centered: true,
            });
          } else {
            ErrorToast('Có lỗi ! Vui lòng liên hệ giảng viên để giải quyết', 3500);
            Notiflix.Block.remove('#root');
            Notiflix.Block.remove('.sl-box');
            setShowAttendance(false);
          }
        } else if (verifyFace === 403) {
          // ErrorToast('Khuôn mặt không khớp . Vui lòng không gian lận trong điểm danh', 3500);
          // Notiflix.Block.remove('.sl-box');
          setShowAttendance(false);
          Notiflix.Block.remove('#root');
          Notiflix.Block.remove('.sl-box');
          ModalConfirm.confirm({
            title: 'Cảnh báo',
            icon: '',
            content: `Khuôn mặt không khớp . Vui lòng quét đúng quy định và không điểm danh hộ`,
            // okText: 'Thử lại',
            // cancelText: 'Đóng',
            onOk: () => {
              cancelScanQR();
            },
            // okButtonProps: {
            //   style: {
            //     backgroundColor: '#ff4d4f',
            //   },
            // },
            centered: true,
          });
        } else {
          ErrorToast('Đã có lỗi xảy ra vui lòng quét khuôn mặt đúng quy định', 3500);
          Notiflix.Block.remove('#root');
          Notiflix.Block.remove('.sl-box');
        }

        Notiflix.Block.remove('#root');
        Notiflix.Block.remove('.sl-box');
      } else {
        setShowAttendance(false);
        Notiflix.Block.remove('#root');
        Notiflix.Block.remove('.sl-box');
        ModalConfirm.confirm({
          title: 'Cảnh báo',
          icon: '',
          content: `Thất bại ! Ngoài phạm vi điểm danh.(Lưu ý: Nếu bạn cố tình gian lận trong quá trình điểm danh thì tài khoản sẽ bị khóa!)`,
          // okText: 'Thử lại',
          // cancelText: 'Đóng',
          onOk: () => {
            cancelScanQR();
          },
          // okButtonProps: {
          //   style: {
          //     backgroundColor: '#ff4d4f',
          //   },
          // },
          centered: true,
        });
      }
    } else {
      ErrorToast('Thất bại!Có lỗi xảy ra. Vui lòng thử lại', 3500);
      Notiflix.Block.remove('#root');
      Notiflix.Block.remove('.sl-box');
    }
    Notiflix.Block.remove('#root');
    Notiflix.Block.remove('.sl-box');
  };

  const renderBody = () => {
    return (
      <>
        <Form onSubmit={handleSubmit(handleAttendanceClassroom)} encType="multipart/form-data">
          <div className="row p-5">
            <div className="col md-6">
              <div>
                <div className="d-flex justify-content-center">
                  <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width={340} height={300} />
                </div>
                <div className="d-flex justify-content-center mb-3">
                  {/* <Button onClick={captureImage}>Chụp ảnh</Button> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row pb-2">
            <Form.Group className="d-flex justify-content-center">
              <Button type="submit" variant="info" className="me-3 font-weight-bold">
                Điểm danh
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="font-weight-bold"
                onClick={() => setShowAttendance(false)}
              >
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
      <div className="row mt-5 justify-content-center">
        {/* <div className="col col-md-3"></div> */}
        <div className=" col-xl-12 col-md-12 col-xs-12 attendance_body">
          <h4 className="text-center">Thông tin điểm danh</h4>
          <Form encType="multipart/form-data">
            <div className="row p-5">
              {/* <div className="col md-6"> */}
              <div className="row">
                <div className="col-xl-6 col-xs-12  col-md-6">
                  <Form.Group className=" mb-3">
                    <div className="cp-input">
                      <p className="font-weight-bold">Mã lớp</p>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        placeholder="Nhập mã lớp"
                        value={dataAttendance && dataAttendance.dataAttendance.code_classroom}
                        {...register('code_classroom', { readOnly: true })}
                        style={{ backgroundColor: '#e9ecef', caretColor: 'transparent' }}
                      />
                      {/* <small className="text-danger font-weight-bold">{errors?.classroom_code?.message}</small> */}
                    </div>
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-6 col-xs-12  col-md-6">
                  <Form.Group className=" mb-3">
                    <div className="cp-input">
                      <p className="font-weight-bold">Tên giáo viên</p>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        placeholder="Nhập mã lớp"
                        value={dataAttendance && dataAttendance.dataAttendance.name_teacher}
                        {...register('name_teacher', { readOnly: true })}
                        style={{ backgroundColor: '#e9ecef', caretColor: 'transparent' }}
                      />
                      {/* <small className="text-danger font-weight-bold">{errors?.classroom_code?.message}</small> */}
                    </div>
                  </Form.Group>
                </div>
                <div className=" col-xl-6 col-xs-12  col-md-6">
                  <Form.Group className=" mb-3">
                    <div className="cp-input">
                      <p className="font-weight-bold">Tên lớp</p>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        placeholder="Nhập mã lớp"
                        value={dataAttendance && dataAttendance.dataAttendance.name_classroom}
                        {...register('name_classroom', { readOnly: true })}
                        style={{ backgroundColor: '#e9ecef', caretColor: 'transparent' }}
                      />
                      {/* <small className="text-danger font-weight-bold">{errors?.classroom_code?.message}</small> */}
                    </div>
                  </Form.Group>
                </div>
              </div>
              <div className="row">
                <div className="col col-md-6">
                  <Form.Group className=" mb-3">
                    <div className="cp-input">
                      <p className="font-weight-bold">Tuần</p>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        placeholder="Nhập mã lớp"
                        value={dataAttendance && dataAttendance.dataAttendance.attendance_week}
                        {...register('attendance_week', { readOnly: true })}
                        style={{ backgroundColor: '#e9ecef', caretColor: 'transparent' }}
                      />
                      {/* <small className="text-danger font-weight-bold">{errors?.classroom_code?.message}</small> */}
                    </div>
                  </Form.Group>
                </div>
                <div className="col col-md-6">
                  <Form.Group className=" mb-3">
                    <div className="cp-input">
                      <p className="font-weight-bold">Tiết</p>
                      <Form.Control
                        type="text"
                        value={dataAttendance && dataAttendance.dataAttendance.attendance_lesson}
                        {...register('attendance_lesson', { readOnly: true })}
                        style={{ backgroundColor: '#e9ecef', caretColor: 'transparent' }}
                      />
                      {/* <small className="text-danger font-weight-bold">{errors?.classroom_code?.message}</small> */}
                    </div>
                  </Form.Group>
                </div>
              </div>

              {/* Hidden */}
              {/* Km */}
              <Form.Control
                type="text"
                placeholder="Nhập mã lớp"
                value={dataAttendance && dataAttendance.dataAttendance.attendance_range}
                {...register('attendance_range')}
                hidden
              />
              {/* Time */}
              <Form.Control
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={dataAttendance && dataAttendance.dataAttendance.attendance_time}
                {...register('attendance_time')}
                hidden
              />
              {/* ID classroom */}
              <Form.Control
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={dataAttendance && dataAttendance.dataAttendance.id_classroom}
                {...register('classroom_id')}
                hidden
              />
              {/*hour create */}
              <Form.Control
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={dataAttendance && dataAttendance.dataAttendance.create_at}
                {...register('create_at')}
                hidden
              />
              {/*Token */}
              <Form.Control
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={dataAttendance && dataAttendance.dataAttendance.tokensAdmin}
                {...register('tokensAdmin')}
                hidden
              />

              {/*Location Latitude */}
              <Form.Control
                {...register('latitude_admin')}
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={dataAttendance && dataAttendance.dataAttendance.location.latitude}
                hidden
              />

              {/*Location Longitude */}
              <Form.Control
                {...register('longitude_admin')}
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={dataAttendance && dataAttendance.dataAttendance.location.longitude}
                hidden
              />
            </div>
            {/* </div> */}
            <div className="row pb-2">
              <Form.Group className="d-flex justify-content-center">
                <Button
                  type="button"
                  variant="info"
                  className="me-3 font-weight-bold"
                  onClick={() => setShowAttendance(true)}
                >
                  Điểm danh
                </Button>
                <Button type="button" variant="secondary" className="font-weight-bold" onClick={() => cancelScanQR()}>
                  Quay lại
                </Button>
              </Form.Group>
            </div>
            <Modal
              show={showAttendance}
              backdrop={backdrop}
              setStateModal={() => setShowAttendance()}
              elementModalTitle={<p>Xác thực khuôn mặt</p>}
              elementModalBody={renderBody()}
            />
          </Form>
        </div>
        {/* <div className="col col-md-3"></div> */}
      </div>
    </>
  );
};
export default Attendance;
