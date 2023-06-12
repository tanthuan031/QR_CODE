import React, { useEffect, useState } from 'react';
import { useZxing } from 'react-zxing';
import './style.css';
import { Button, Form } from 'react-bootstrap';
import {
  setAttendanceClient,
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
} from '../../../../../api/Client/Classroom/classroomClientAPI';
// import { getDistanceFromLatLonInKm } from '../../../../../utils/getDistanceFromLatLonInKm';
const ScanQRCode = ({ onDetected }) => {
  const dispatch = useDispatch();
  const [result, setResult] = useState('');
  const [resultAtt, setResultAtt] = useState();
  const [showAttendance, setShowAttendance] = useState(false);
  const [backdrop, setBackdrop] = useState('static');
  let countStep = 0;
  const detailClassroomClient = useSelector(isDetailClassroomClientSelector);
  const dataDetail = useSelector(dataDetailClassroomClientSelector);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
      },
      (error) => console.log(error)
    );
  }, []);
  const { ref, off, start } = useZxing({
    onResult(result) {
      try {
        const checkData = JSON.parse(atob(result.getText()));
        if (checkData.name_classroom && checkData.attendance_time && checkData.attendance_week) {
          setResult(atob(result.getText()));
          // setShowAttendance(true);

          const parsedResult = checkData;
          dispatch(
            setAttendanceClient({
              dataLocation: currentLocation,
              dataAttendance: parsedResult,
            })
          );
          dispatch(setIsAttendanceClient(true));
          dispatch(setIsScanQR(false));
        } else {
          countStep++;
          if (countStep == 5) {
            cancelScanQR();
            ModalConfirm.confirm({
              title: 'Cảnh báo',
              icon: '',
              content: `Bạn đã quét mã QR không đúng 5 lần . Vui lòng thử lại nếu cố tình vi phạm tài khoản bạn sẽ bị tạm khóa.`,
              okText: 'Thử lại',
              // cancelText: 'Đóng',
              onOk: () => {
                countStep = 0;
                dispatch(setIsScanQR(true));
                dispatch(
                  setIsDetailClassroomClient({
                    ...detailClassroomClient,
                    checkDetail: false,
                  })
                );
                dispatch(setIsAttendanceClient(false));
              },
              okButtonProps: {
                style: {
                  backgroundColor: '#ff4d4f',
                },
              },
              centered: true,
            });
          } else {
            ErrorToast('QR bạn scan không tồn tại Error', 1000);
          }
        }
      } catch (error) {
        countStep++;
        if (countStep == 5) {
          cancelScanQR();
          ModalConfirm.confirm({
            title: 'Cảnh báo',
            icon: '',
            content: `Bạn đã quét mã QR không đúng 5 lần . Vui lòng thử lại nếu cố tình vi phạm tài khoản bạn sẽ bị tạm khóa.`,
            okText: 'Thử lại',
            // cancelText: 'Đóng',
            onOk: () => {
              countStep = 0;
              dispatch(setIsScanQR(true));
              dispatch(
                setIsDetailClassroomClient({
                  ...detailClassroomClient,
                  checkDetail: false,
                })
              );
              dispatch(setIsAttendanceClient(false));
            },
            okButtonProps: {
              style: {
                backgroundColor: '#ff4d4f',
              },
            },
            centered: true,
          });
        } else {
          ErrorToast('QR bạn scan không tồn tại Error', 1000);
        }
      }
    },
  });
  const cancelScanQR = () => {
    dispatch(setIsScanQR(false));
    dispatch(
      setIsDetailClassroomClient({
        ...detailClassroomClient,
        checkDetail: true,
      })
    );
    dispatch(setIsAttendanceClient(false));
  };
  // Get location

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       setCurrentLocation({ latitude, longitude });
  //     },
  //     (error) => console.log(error)
  //   );
  //   if (result) {
  //     const parsedResult = JSON.parse(result);
  //     dispatch(
  //       setAttendanceClient({
  //         dataLocation: currentLocation,
  //         dataAttendance: parsedResult,
  //       })
  //     );
  //   }
  // }, [result]);

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

  const handleAttendanceClassroom = async (data) => {
    const location = {
      lat1: currentLocation.latitude,
      lon1: currentLocation.longitude,
      lat2: resultAtt.location.latitude,
      lon2: resultAtt.location.longitude,
    };

    const formatData = {
      attendance_range: resultAtt.attendance_range,
      attendance_time: resultAtt.attendance_time,
      attendance_week: resultAtt.attendance_week,
      attendance_lesson: resultAtt.attendance_lesson,
      classroom_id: resultAtt.id_classroom,
      create_at: resultAtt.create_at,
      tokensAdmin: resultAtt.tokensAdmin,
    };
    if (formatData) {
      const checkKm = await getDistanceFromLatLonInKm(location);
      if (checkKm.value <= Number(resultAtt.attendance_range) * 1000) {
        BlockUICLIENT('#root', 'fixed');
        const result = await attendanceStudentClient(formatData);
        if (result === 200) {
          SuccessToast('Điểm danh thành công', 3500);
          Notiflix.Block.remove('.sl-box');
          handleDetailClassroom(resultAtt.id_classroom);
        } else if (result === 403) {
          ErrorToast('Thất bại!Hết thời gian điểm danh', 3500);
          Notiflix.Block.remove('.sl-box');
        } else if (result === 404) {
          ErrorToast('Thất bại!Bạn không có trong lớp học', 3500);
          Notiflix.Block.remove('.sl-box');
        } else {
          ErrorToast('Có lỗi ! Vui lòng liên hệ giảng viên để giải quyết', 3500);
          Notiflix.Block.remove('.sl-box');
        }
        Notiflix.Block.remove('#root');
      } else {
        ErrorToast('Thất bại ! Bạn đang điểm danh gian lận', 3500);
        Notiflix.Block.remove('.sl-box');
        Notiflix.Block.remove('#root');
      }
    } else {
      ErrorToast('Thất bại!Có lỗi xảy ra. Vui lòng thử lại', 3500);
      Notiflix.Block.remove('.sl-box');
    }

    Notiflix.Block.remove('#root');
  };
  const renderBody = () => {
    return (
      <>
        <Form onSubmit={handleSubmit(handleAttendanceClassroom)} encType="multipart/form-data">
          <div className="row p-5">
            <div className="col md-6">
              <div className="row">
                <div className="col col-md-6">
                  <Form.Group className=" mb-3">
                    <div className="cp-input">
                      <p className="font-weight-bold">Mã lớp</p>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        placeholder="Nhập mã lớp"
                        value={resultAtt && resultAtt.code_classroom}
                        {...register('code_classroom', { readOnly: true })}
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
                      <p className="font-weight-bold">Tên giáo viên</p>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        placeholder="Nhập mã lớp"
                        value={resultAtt && resultAtt.name_teacher}
                        {...register('name_teacher', { readOnly: true })}
                        style={{ backgroundColor: '#e9ecef', caretColor: 'transparent' }}
                      />
                      {/* <small className="text-danger font-weight-bold">{errors?.classroom_code?.message}</small> */}
                    </div>
                  </Form.Group>
                </div>
                <div className="col col-md-6">
                  <Form.Group className=" mb-3">
                    <div className="cp-input">
                      <p className="font-weight-bold">Tên lớp</p>
                      <Form.Control
                        type="text"
                        maxLength={10}
                        placeholder="Nhập mã lớp"
                        value={resultAtt && resultAtt.name_classroom}
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
                        value={resultAtt && resultAtt.attendance_week}
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
                        value={resultAtt && resultAtt.attendance_lesson}
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
                value={resultAtt && resultAtt.attendance_range}
                {...register('attendance_range')}
                hidden
              />
              {/* Time */}
              <Form.Control
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={resultAtt && resultAtt.attendance_time}
                {...register('attendance_time')}
                hidden
              />
              {/* ID classroom */}
              <Form.Control
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={resultAtt && resultAtt.id_classroom}
                {...register('classroom_id')}
                hidden
              />
              {/*hour create */}
              <Form.Control
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={resultAtt && resultAtt.create_at}
                {...register('create_at')}
                hidden
              />
              {/*Token */}
              <Form.Control
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={resultAtt && resultAtt.tokensAdmin}
                {...register('tokensAdmin')}
                hidden
              />

              {/*Location Latitude */}
              <Form.Control
                {...register('latitude_admin')}
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={resultAtt && resultAtt.location.latitude}
                hidden
              />

              {/*Location Longitude */}
              <Form.Control
                {...register('longitude_admin')}
                type="text"
                maxLength={10}
                placeholder="Nhập mã lớp"
                value={resultAtt && resultAtt.location.longitude}
                hidden={true}
              />
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
      <h5 className="font-weight-bold mb-3">Điểm danh</h5>
      <div className="row mt-5 justify-content-center">
        <h6 className="font-weight-bold mb-3 text-center text-success">
          Vui lòng quét mã QR được cung cấp bởi giảng viên
        </h6>
        <div className="contain_qr">
          <video ref={ref} className="video_qr" />
        </div>
        <div className="mb-3 text-center ">
          <span className="text-danger font-weight-bold ">Lưu ý: </span>Mọi hành vi gian lận trong điểm danh sẽ bị khóa
          tài khoản và không được điểm danh.
        </div>
        <div className="d-flex justify-content-center pt-3">
          <Button className="btn-secondary" onClick={() => cancelScanQR()}>
            Hủy
          </Button>
        </div>
      </div>

      <Modal
        show={showAttendance}
        backdrop={backdrop}
        setStateModal={() => setShowAttendance()}
        elementModalTitle={<p>Điểm danh</p>}
        elementModalBody={renderBody()}
      />
    </>
  );
};
export default ScanQRCode;
