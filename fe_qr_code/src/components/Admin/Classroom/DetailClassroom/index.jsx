import { yupResolver } from '@hookform/resolvers/yup';
import { Button as ButtonAntd, Checkbox, Table, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Form, InputGroup, OverlayTrigger } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import {
  FaArrowLeft,
  FaBell,
  FaEdit,
  FaFileExport,
  FaMixcloud,
  FaQrcode,
  FaSearch,
  FaTrash,
  FaUser,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addSchemaNotification, addSchemaStudent } from '../../../../adapter/classroom';
import {
  addDetailClassroom,
  deleteDetailStudent,
  editAttendanceStudent,
  getClassroomById,
} from '../../../../api/Admin/Classroom/classroomAPI';
import {
  setDataCreateQRCode,
  setDataDetailClassroom,
  setIsDetailClassroom,
  setIsQR,
} from '../../../../redux/reducer/classroom/classroom.reducer';
import {
  dataDetailClassroomSelector,
  isDetailClassroomSelector,
} from '../../../../redux/selectors/classroom/classroom.selector';
import Modal from '../../../Layouts/Modal';

import './style.css';
import { BlockUICLIENT } from '../../../Layouts/Notiflix';
import Notiflix from 'notiflix';
import { ErrorToast, SuccessToast } from '../../../Layouts/Alerts';
import { getCookiesAdmin } from '../../../../api/Admin/Auth/authAPI';
import { getDistanceFromLatLonInKm } from '../../../../utils/getDistanceFromLatLonInKm';
import {
  createNotificationAdmin,
  getAllNotificationsAdmin,
} from '../../../../api/Admin/NotificationAdmin/notificationAdminAPI';
import { NotificationAdmin } from '../Notification';
import { setDataNotificationAdmin } from '../../../../redux/reducer/notification/notification.reducer';
import { Modal as ModalConfirm } from 'antd';
export default function DetailClassroomTable(props) {
  const [backdrop, setBackdrop] = React.useState('static');
  const [editTable, setEditTable] = React.useState(true);
  const [createQRCode, setCreateQRCode] = React.useState(false);
  // Show Create QR
  const [show, setShow] = React.useState(false);
  // Show add student
  const [showAddStudent, setShowAddStudent] = React.useState(false);
  // Show edit student
  const [showEditStudent, setShowEditStudent] = React.useState(false);
  const [idEditStudent, setIdEditStudent] = React.useState({
    student_code: 0,
    classroom_id: 0,
    week: 0,
    lesson: 0,
    status: 0,
    image: null,
  });
  const [showCreateNotification, setCreateNotification] = React.useState(false);
  //data submit form create QR code
  const [attendance_range, setAttendanceRange] = React.useState(0);
  const [attendance_time, setAttendanceTime] = React.useState(0);
  const [attendance_week, setAttendanceWeek] = React.useState(0);
  const [attendance_lesson, setAttendanceLesson] = React.useState(0);
  // Get location
  const dispatch = useDispatch();
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
  }, [dispatch]);

  const isDetailClassroom = useSelector(isDetailClassroomSelector);

  const dataDetail = useSelector(dataDetailClassroomSelector);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(addSchemaStudent),
    defaultValues: {
      student_code: '',
      last_name: '',
      first_name: '',
    },
  });
  console.log('test', isDetailClassroom);
  const {
    register: registerCreateNotification,
    handleSubmit: handleSubmitCreateNotification,
    reset: resetNotification,
    control: controlNotification,
    formState: { isValid: isValidNotification, errors: notificationErrors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(addSchemaNotification),
  });

  const setStateModal = (value) => {
    setShow(false);
  };

  const createQTCode = () => {
    const now = new Date();
    const options = { timeZone: 'Asia/Ho_Chi_Minh' };
    const tokensAdmin = getCookiesAdmin('token');
    const data = {
      attendance_range: attendance_range,
      attendance_time: attendance_time,
      attendance_week: attendance_week,
      attendance_lesson: attendance_lesson,
      id_classroom: isDetailClassroom.idDetail,
      name_classroom: isDetailClassroom.nameClassroom,
      code_classroom: isDetailClassroom.classCode,
      name_teacher: isDetailClassroom.nameTeacher,
      create_at: now.toLocaleString('en-US', options),
      tokensAdmin: tokensAdmin,
      location: currentLocation,
    };
    dispatch(setDataCreateQRCode(data));
    dispatch(setIsQR(true));
    dispatch(
      setIsDetailClassroom({
        ...isDetailClassroom,
        checkDetail: false,
      })
    );
  };
  const getAllStudentDetails = async (data) => {
    const result = await getClassroomById(isDetailClassroom.idDetail);
    if (result === 401) {
      return false;
    } else if (result === 500) {
      return false;
    } else {
      dispatch(
        setDataDetailClassroom({
          ...dataDetail,
          data: result,
        })
      );
    }
  };
  const renderBody = () => {
    return (
      <Form>
        <div className="row p-5">
          <div className="col md-6">
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Phạm vi điểm danh</p>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(option) => setAttendanceRange(option.target.value)}
                >
                  <option value={0}>Open this select menu</option>
                  <option value={5}>5 Km</option>
                  <option value={10}>10 Km </option>
                  <option value={15}>15 Km</option>
                  <option value={20}>20 Km</option>
                </Form.Select>
                <small className="text-danger font-weight-bold"></small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Thời gian điểm danh</p>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(option) => setAttendanceTime(option.target.value)}
                >
                  <option value={0}>Open this select menu</option>
                  <option value={1}>1 phút </option>
                  <option value={5}>5 phút </option>
                  <option value={10}>10 phút</option>
                  <option value={15}>15 phút</option>
                  <option value={20}>20 phút</option>
                </Form.Select>
                <small className="text-danger font-weight-bold"></small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Chọn tuần điểm danh</p>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(option) => setAttendanceWeek(option.target.value)}
                >
                  <option value={0}>Open this select menu</option>
                  {(() => {
                    const divs = Array.from({ length: dataDetail.numberRollCall }, (_, index) => (
                      <option value={index + 1} key={index}>
                        Tuần {index + 1}
                      </option>
                    ));
                    return divs;
                  })()}
                </Form.Select>
                <small className="text-danger font-weight-bold"></small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Chọn tiết trong tuần</p>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(option) => setAttendanceLesson(option.target.value)}
                >
                  <option value={0}>Open this select menu</option>
                  {(() => {
                    const divs = Array.from({ length: dataDetail.numberLessonWeek }, (_, index) => (
                      <option value={index + 1} key={index}>
                        Tiết thứ {index + 1} trong tuần
                      </option>
                    ));
                    return divs;
                  })()}
                </Form.Select>
                <small className="text-danger font-weight-bold"></small>
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row pb-2">
          <Form.Group className="d-flex justify-content-center">
            <Button
              type="button"
              variant="info"
              className="me-3 font-weight-bold"
              onClick={() => createQTCode()}
              disabled={attendance_range == 0 || attendance_time == 0 || attendance_lesson == 0 || attendance_week == 0}
            >
              Tạo QR
            </Button>
            <Button type="button" variant="secondary" className="font-weight-bold" onClick={() => setStateModal()}>
              Quay lại
            </Button>
          </Form.Group>
        </div>
      </Form>
    );
  };

  const setStateModalAddStudent = (value) => {
    setShowAddStudent(false);
  };

  const handleAddStudent = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    const dataStudent = {
      classroom_id: isDetailClassroom.idDetail,
      detail_classroom: [data],
    };
    const result = await addDetailClassroom(dataStudent);
    if (result === 200) {
      getAllStudentDetails();
      SuccessToast('Thêm sinh viên thành công', 3500);
      Notiflix.Block.remove('.sl-box');
      setShowAddStudent(false);
      reset();
    } else {
      ErrorToast('Thêm sinh viên thất bại', 3500);
      Notiflix.Block.remove('.sl-box');
    }
    Notiflix.Block.remove('#root');
  };
  const renderBodyAddStudent = () => {
    return (
      <Form onSubmit={handleSubmit(handleAddStudent)} encType="multipart/form-data">
        <div className="row p-5">
          <div className="col md-6">
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">MSSV</p>
                <Form.Control type="text" maxLength={128} {...register('student_code')} />
                <small className="text-danger font-weight-bold">{errors?.student_code?.message}</small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Họ và tên lót</p>
                <Form.Control type="text" min={1} max={20} {...register('last_name')} />
                <small className="text-danger font-weight-bold">{errors?.last_name?.message}</small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Tên sinh viên</p>
                <Form.Control type="text" min={1} max={5} {...register('first_name')} />
                <small className="text-danger font-weight-bold">{errors?.first_name?.message}</small>
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row pb-3">
          <Form.Group className="d-flex justify-content-center">
            <Button type="submit" variant="info" className="me-3 font-weight-bold">
              Lưu lại
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="font-weight-bold"
              onClick={() => setStateModalAddStudent()}
            >
              Quay lại
            </Button>
          </Form.Group>
        </div>
      </Form>
    );
  };

  // Handle edit student

  const setStateModalEditStudent = (value) => {
    setShowEditStudent(false);
  };

  //

  const handleUpdateAttendanceStudent = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    const dataEdit = idEditStudent;
    const result = await editAttendanceStudent(1, dataEdit);

    if (result === 200) {
      getAllStudentDetails();
      SuccessToast('Điểm danh thành công', 3500);
      Notiflix.Block.remove('.sl-box');
      setShowEditStudent(false);
      setIdEditStudent({
        ...idEditStudent,
        student_code: 0,
        classroom_id: 0,
        week: 0,
        lesson: 0,
        status: 0,
        image: null,
      });
    } else if (result === 401) {
      ErrorToast('Bạn chưa đăng nhập', 3500);
      Notiflix.Block.remove('.sl-box');
    } else {
      ErrorToast('Tuần hoặc tiết chưa được điểm danh', 3500);
      Notiflix.Block.remove('.sl-box');
    }
    Notiflix.Block.remove('#root');
  };

  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  const renderBodyEditStudent = () => {
    return (
      <>
        <Form encType="multipart/form-data">
          <div className="row p-5">
            <div className="col md-6">
              <div className="row">
                <h6 className="text-center">Ảnh xác minh sinh viên</h6>
                <div className="text-center">
                  <img
                    src={idEditStudent.image}
                    onClick={handleClick}
                    style={{
                      width: '150px',
                      height: '110px',
                      textAlign: 'center',
                      boxShadow: '0 0.3125rem 0.625rem 0 rgba(0, 0, 0, 0.5) !important',
                      border: '1px solid #333',
                      borderRadius: '10px',
                    }}
                  />
                  {isOpen && (
                    <div
                      className="overlay"
                      onClick={handleClose}
                      style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                      }}
                    >
                      <img
                        src={idEditStudent.image}
                        className="img-large"
                        alt="Hình ảnh mở to"
                        style={{ maxWidth: '40%', maxHeight: '40%', borderRadius: '10px' }}
                      />
                    </div>
                  )}
                </div>
              </div>
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">MSSV</p>
                  <Form.Control
                    type="text"
                    maxLength={128}
                    value={idEditStudent.student_code}
                    name="student_code"
                    disabled
                  />
                  <small className="text-danger font-weight-bold">{errors?.student_code?.message}</small>
                </div>
              </Form.Group>
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Chọn tuần điểm danh</p>
                  <Form.Select
                    aria-label="Default select example"
                    name="number_roll_call"
                    onChange={(option) =>
                      setIdEditStudent({
                        ...idEditStudent,
                        week: option.target.value,
                      })
                    }
                  >
                    <option value={0}>Open this select menu</option>
                    {(() => {
                      const divs = Array.from({ length: dataDetail.numberRollCall }, (_, index) => (
                        <option value={index + 1} key={index}>
                          Tuần {index + 1}
                        </option>
                      ));
                      return divs;
                    })()}
                  </Form.Select>
                  <small className="text-danger font-weight-bold"></small>
                </div>
              </Form.Group>
              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Chọn tiết trong tuần</p>
                  <Form.Select
                    aria-label="Default select example"
                    name="number_lesson"
                    onChange={(option) =>
                      setIdEditStudent({
                        ...idEditStudent,
                        lesson: option.target.value,
                      })
                    }
                  >
                    <option value={0}>Open this select menu</option>
                    {(() => {
                      const divs = Array.from({ length: dataDetail.numberLessonWeek }, (_, index) => (
                        <option value={index + 1} key={index}>
                          Tiết thứ {index + 1} trong tuần
                        </option>
                      ));
                      return divs;
                    })()}
                  </Form.Select>
                  <small className="text-danger font-weight-bold"></small>
                </div>
              </Form.Group>

              <Form.Group className=" mb-3">
                <div className="cp-input">
                  <p className="font-weight-bold">Trạng thái</p>
                  <Form.Check
                    inline
                    label="Có"
                    name="status"
                    type="radio"
                    id={`inline-radio-2`}
                    value={0}
                    checked={idEditStudent.status == 0}
                    onChange={(option) =>
                      setIdEditStudent({
                        ...idEditStudent,
                        status: option.target.value,
                      })
                    }
                  />
                  <Form.Check
                    inline
                    label="Vắng"
                    name="status"
                    type="radio"
                    id={`inline-radio-1`}
                    value={1}
                    checked={idEditStudent.status == 1}
                    onChange={(option) =>
                      setIdEditStudent({
                        ...idEditStudent,
                        status: option.target.value,
                      })
                    }
                  />
                  <small className="text-danger font-weight-bold"></small>
                </div>
              </Form.Group>
            </div>
          </div>
          <div className="row pb-3">
            <Form.Group className="d-flex justify-content-center">
              <Button
                type="button"
                variant="info"
                className="me-3 font-weight-bold"
                onClick={() => handleUpdateAttendanceStudent()}
                disabled={idEditStudent.week == 0 || idEditStudent.lesson == 0}
              >
                Cập nhật
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="font-weight-bold"
                onClick={() => setStateModalEditStudent()}
              >
                Quay lại
              </Button>
            </Form.Group>
          </div>
        </Form>
      </>
    );
  };

  // Notification
  const handleSubmitNotifications = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    const dataNotifi = {
      class_code: data.class_code,
      title: data.title,
      content: data.content,
    };
    const result = await createNotificationAdmin(dataNotifi);
    if (result === 200) {
      const result1 = await getAllNotificationsAdmin({
        classCode: isDetailClassroom.classCode,
        sort: [
          {
            key: 'updated_at',
            value: 'desc',
          },
        ],
      });
      if (result1 === 401) {
        ErrorToast('Có lỗi xảy ra . Vui lòng thử lại sau', 1500);
        Notiflix.Block.remove('#root');
        return false;
      } else if (result1 === 400 || result1 === 404 || result1 === 500) {
        ErrorToast('Có lỗi xảy ra . Vui lòng thử lại sau', 1500);
        Notiflix.Block.remove('#root');
        return false;
      } else {
        dispatch(setDataNotificationAdmin(result1.data));
        SuccessToast('Thông báo đã được gửi đi', 3500);
        Notiflix.Block.remove('.sl-box');
        setCreateNotification(false);
        resetNotification();
      }
    } else {
      ErrorToast('Tạo thông báo thất bại', 3500);
      Notiflix.Block.remove('.sl-box');
    }
    Notiflix.Block.remove('#root');
  };

  const renderBodyCreateNotification = () => {
    return (
      <Form encType="multipart/form-data" onSubmit={handleSubmitCreateNotification(handleSubmitNotifications)}>
        <div className="row p-5">
          <div className="col md-6">
            <div className="row">
              <div className="col-md-6">
                <Form.Group className=" mb-3">
                  <div className="cp-input">
                    <p className="font-weight-bold">Mã lớp</p>
                    <Form.Control
                      type="text"
                      maxLength={128}
                      value={isDetailClassroom.classCode}
                      name="class_code"
                      disabled
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className=" mb-3">
                  <div className="cp-input">
                    <p className="font-weight-bold">Tên lớp</p>
                    <Form.Control
                      type="text"
                      maxLength={128}
                      value={isDetailClassroom.nameClassroom}
                      name="class_name"
                      disabled
                    />
                  </div>
                </Form.Group>
              </div>
            </div>

            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">
                  Tiêu đề <span className="text-danger">*</span>
                </p>
                <Form.Control
                  type="text"
                  maxLength={128}
                  name="title"
                  placeholder="Nhập tiêu đề..."
                  {...registerCreateNotification('title')}
                />
                <small className="text-danger font-weight-bold">{notificationErrors?.title?.message}</small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">
                  Nội dung <span className="text-danger">*</span>
                </p>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập nội dung...  "
                  name="content"
                  {...registerCreateNotification('content')}
                />
                <small className="text-danger font-weight-bold">{notificationErrors?.content?.message}</small>
              </div>
            </Form.Group>
            <Form.Control
              type="text"
              maxLength={128}
              value={isDetailClassroom.classCode}
              name="class_code"
              {...registerCreateNotification('class_code')}
              hidden
            />
          </div>
        </div>
        <div className="row pb-3">
          <Form.Group className="d-flex justify-content-center">
            <Button type="submit" variant="info" className="me-3 font-weight-bold">
              Tạo
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="font-weight-bold"
              onClick={() => setCreateNotification(false)}
            >
              Quay lại
            </Button>
          </Form.Group>
        </div>
      </Form>
    );
  };

  const setStateModalCreateNotification = (value) => {
    setCreateNotification(false);
  };

  const backToPage = () => {
    BlockUICLIENT('#root', 'fixed');
    dispatch(
      setIsDetailClassroom({
        ...isDetailClassroom,
        checkDetail: false,
      })
    );
    dispatch(setIsQR(false));
    Notiflix.Block.remove('#root');
  };
  const handleExport = () => {
    const XLSX = require('xlsx');

    // Chuyển đổi dữ liệu thành định dạng có thể xuất ra
    const exportData = dataDetail.data.map((detail) => {
      const exportItem = {
        '-': '', // Cột hành động
        MSSV: detail.student_code,
        'TÊN SINH VIÊN': `${detail.first_name} ${detail.last_name}`,
      };

      // Thêm cột cho từng tuần
      for (let i = 0; i < dataDetail.numberRollCall; i++) {
        const week = i + 1;
        const weekData = detail.attendances.filter((attendance) => attendance.week == week);

        if (weekData.length > 0) {
          const mergedCell = {
            s: { r: 0, c: i + 3 }, // Tọa độ ô bắt đầu (dòng, cột)
            e: { r: dataDetail.numberLessonWeek - 1, c: i + 3 }, // Tọa độ ô kết thúc (dòng, cột)
          };

          const lessons = weekData.map((attendance) => attendance.lesson);
          const checkedLessons = Array.from({ length: dataDetail.numberLessonWeek }, (_, j) =>
            lessons.includes(String(j + 1)) ? 'X' : ''
          );

          exportItem[`Tuần ${week}`] = { v: checkedLessons.join(' '), s: mergedCell }; // Gán ô đã gộp cho cột tuần
        } else {
          exportItem[`Tuần ${week}`] = ''; // Không có dữ liệu điểm danh cho tuần này
        }
      }
      exportItem['ĐIỂM'] = Number(detail.score).toFixed(2);

      return exportItem;
    });

    // Tạo worksheet từ dữ liệu
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Điều chỉnh độ rộng cột
    const columnWidths = [
      { wch: 2 }, // Độ rộng cột hành động
      { wch: 10 }, // Độ rộng cột MSSV
      { wch: 20 }, // Độ rộng cột TÊN SINH VIÊN
      { wch: 5 }, // Độ rộng cột ĐIỂM
    ];

    for (let i = 0; i < dataDetail.numberRollCall; i++) {
      columnWidths.push({ wch: 10 }); // Độ rộng cột tuần
    }

    worksheet['!cols'] = columnWidths;

    // Tạo workbook và thêm worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    // Xuất workbook ra file Excel
    const excelFileName = `${isDetailClassroom.nameClassroom}.xlsx`;
    XLSX.writeFile(workbook, excelFileName);
  };
  const handleDeleteStudent = async (e, id) => {
    e.stopPropagation();

    ModalConfirm.confirm({
      title: 'Cảnh báo',
      icon: '',
      content: `Bạn muốn xóa sinh viên này`,
      okText: 'Xóa',
      // cancelText: 'Đóng',
      onOk: async () => {
        BlockUICLIENT('#root', 'fixed');
        const result = await deleteDetailStudent(id);
        if (result === 200) {
          SuccessToast('Xóa sinh viên thành công', 3500);
          Notiflix.Block.remove('.sl-box');
          getAllStudentDetails();
        } else if (result === 403) {
          ErrorToast('Xóa sinh viên thất bại', 3500);
          Notiflix.Block.remove('.sl-box');
        } else {
          ErrorToast('Có lỗi . Vui lòng thử lại', 3500);
          Notiflix.Block.remove('.sl-box');
        }
        Notiflix.Block.remove('#root');
      },
      okButtonProps: {
        style: {
          backgroundColor: '#ff4d4f',
        },
      },
      centered: true,
    });
  };
  const columns01 = [
    {
      title: (
        <>
          <Button
            id="create-new-product"
            variant="success"
            className=" btn btn-sm font-weight-bold ms-3 m-r-15"
            size="small"
            onClick={() => handleExport()}
          >
            <FaFileExport />
          </Button>
        </>
      ),
      dataIndex: 'Action',
      key: 'STT',
      width: 100,
      // fixed: 'left',
    },
    {
      title: 'MSSV',
      dataIndex: 'student_code',
      key: 'student_code',
      // width: 200,
      // fixed: 'left',
    },
    {
      title: 'TÊN SINH VIÊN',
      dataIndex: 'full_name',
      key: 'full_name',
      // width: 200,
      // fixed: 'left',
    },
    ...Array.from({ length: dataDetail.numberRollCall }, (_, i) => ({
      //so tuan
      title: `Tuần ${i + 1}`,
      dataIndex: `week${i + 1}`,
      key: `week${i + 1}`,
      // width: 100,
      render: (_, record) => {
        const divs = Array.from({ length: dataDetail.numberLessonWeek }, (_, index) => {
          const attendance = record.attendances.find(
            (a) => a.week == i + 1 && a.lesson == index + 1 && a.student_code == record.student_code
          );
          const checked = attendance && attendance.status === '0';
          return (
            <p
              key={index}
              style={{ textAlign: 'center', width: 90 / dataDetail.numberLessonWeek, border: '1px solid' }}
            >
              <Checkbox checked={checked} />
            </p>
          );
        });
        return <div className="d-flex">{divs} </div>;
      },
    })),
    {
      title: 'ĐIỂM',
      dataIndex: 'score',
      key: 'score',
      fixed: 'right',
      width: 80,
    },
  ];

  const data01 =
    dataDetail !== undefined &&
    dataDetail.data.map((detail) => ({
      key: detail.id,
      Action: (
        <>
          <div className="d-flex">
            <Tooltip title="Điểm danh hộ" placement="topLeft">
              <div
                style={{ fontSize: '1rem', color: '#1677ff', cursor: 'pointer' }}
                onClick={() => {
                  setShowEditStudent(true);
                  setIdEditStudent({
                    ...idEditStudent,
                    student_code: detail.student_code,
                    classroom_id: detail.classroom_id,
                    image: detail.users !== null ? detail.users.image : null,
                  });
                }}
              >
                <FaQrcode />
              </div>
            </Tooltip>
            <Tooltip title="Xóa sinh viên ra khỏi lớp học" placement="topLeft">
              <div
                onClick={(e) => handleDeleteStudent(e, detail.id)}
                style={{ fontSize: '1rem', marginLeft: '10%', color: '#1677ff', cursor: 'pointer' }}
              >
                <FaTrash className="text-danger" />
              </div>
            </Tooltip>
          </div>
        </>
      ),
      student_code: detail.student_code,
      full_name: `${detail.last_name} ${detail.first_name}`,
      attendances: detail.attendances,
      score: <span style={{ marginLeft: '30%', fontWeight: '700' }}>{Number(detail.score).toFixed(2)}</span>,
    }));

  function copyToClipboard(text) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        SuccessToast('Sao chép thành công', 1000);
      })
      .catch((error) => {
        ErrorToast('Không sao chép được', 1000);
      });
  }
  const tooltip = (
    <Tooltip id="tooltip">
      <strong>Holy guacamole!</strong> Check this info.
    </Tooltip>
  );
  return (
    <>
      <div className="row">
        <div className="row">
          <div className=" col-md-4 col-sm-12">
            <div className="d-flex">
              Mã lớp:<span className="font-weight-bold  padding-left-12px"> {isDetailClassroom.classCode}</span>
              <div
                className=" cursor-pointer text-primary "
                onClick={() => copyToClipboard(isDetailClassroom.classCode)}
                size="sm"
                style={{ marginLeft: '5px' }}
              >
                Copy
              </div>
            </div>
          </div>
          <div className=" col-md-8 col-sm-12 ">
            <div className="d-flex justify-content-end">
              {/* <Form>
                <InputGroup>
                  <Form.Control
                    id="search-order"
                    placeholder="Nhập mã lớp..."
                    size="sm"
                    // onChange={(e) => setSearch(e.target.value)}
                  />

                  <Button id="search-user" variant="info" type="submit">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </Form> */}
            </div>
          </div>
        </div>

        <div className="row justify-content-between">
          <div className="col-md-12 col-sm-12 mt-2 ms-3 mb-2">
            <div className="d-flex">
              <Tooltip title="Tạo thông báo" placement="topLeft">
                <Button
                  id="create-new-product"
                  variant="outline-primary"
                  className="font-weight-bold  m-r-15"
                  onClick={() => setCreateNotification(true)}
                  size="sm"
                >
                  <FaBell />
                </Button>
              </Tooltip>
              <Tooltip title="Thêm sinh viên" placement="topLeft">
                <Button
                  id="create-new-product"
                  variant="outline-success"
                  className="font-weight-bold ms-3 m-r-15"
                  onClick={() => setShowAddStudent(true)}
                  size="sm"
                >
                  <FaUser />
                </Button>
              </Tooltip>
              <Tooltip title="Điểm danh" placement="topLeft">
                {' '}
                <Button
                  id="create-new-product"
                  variant="outline-info"
                  className="font-weight-bold ms-3 m-r-15"
                  onClick={() => setShow(true)}
                  size="sm"
                >
                  <FaQrcode />
                </Button>
              </Tooltip>
              <Tooltip title="Quay lại" placement="topLeft">
                {' '}
                <Button
                  size="sm"
                  id="create-new-product"
                  variant="outline-secondary"
                  className="font-weight-bold ms-3 m-r-15"
                  onClick={() => backToPage()}
                >
                  <FaArrowLeft />
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      <div style={{ overflow: 'scroll' }}>
        <Table
          columns={columns01}
          dataSource={data01}
          scroll={{ x: 'max-content', y: 450 }}
          pagination={{ pageSize: 15 }}
        />
      </div>
      <div className="row mt-5">
        <h4 className="header-notification">Danh sách thông báo</h4>
        <NotificationAdmin />
      </div>

      <Modal
        show={show}
        backdrop={backdrop}
        setStateModal={() => setStateModal()}
        elementModalTitle={<p>Tạo QR điểm danh</p>}
        elementModalBody={renderBody()}
      />

      <Modal
        show={showAddStudent}
        backdrop={backdrop}
        setStateModal={() => setStateModalAddStudent()}
        elementModalTitle={<p>Thêm sinh viên</p>}
        elementModalBody={renderBodyAddStudent()}
      />

      <Modal
        show={showEditStudent}
        backdrop={backdrop}
        setStateModal={() => setStateModalEditStudent()}
        elementModalTitle={<p>Cập nhật trạng thái điểm danh</p>}
        elementModalBody={renderBodyEditStudent()}
      />

      <Modal
        show={showCreateNotification}
        backdrop={backdrop}
        setStateModal={() => setStateModalCreateNotification()}
        elementModalTitle={<p>Tạo thông báo</p>}
        elementModalBody={renderBodyCreateNotification()}
      />
    </>
  );
}
