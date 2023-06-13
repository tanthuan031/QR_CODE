import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, List, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { addSchemaStudent } from '../../../../adapter/classroom';
import {
  setIsAttendanceClient,
  setIsDetailClassroomClient,
  setIsScanQR,
} from '../../../../redux/reducer/classroom/classroom.reducer';
import {
  dataDetailClassroomClientSelector,
  isDetailClassroomClientSelector,
  isDetailClassroomSelector,
} from '../../../../redux/selectors/classroom/classroom.selector';
import './style.css';
import Modal from '../../../Layouts/Modal';
import { addAskHistoryPermission } from '../../../../adapter/historyaskpermission';
import { createAskPermissionClient } from '../../../../api/Client/HistoryAskPermission/historyPermissionClientAPI';
import { ErrorToast, SuccessToast } from '../../../Layouts/Alerts';
import Notiflix from 'notiflix';
import { BlockUICLIENT } from '../../../Layouts/Notiflix';
import { NotificationClient } from '../Notification';

export function DetailClassroomClientTable(props) {
  const [show, setShow] = React.useState(false);
  const [showAddStudent, setShowAddStudent] = React.useState(false);
  const isDetailClassroom = useSelector(isDetailClassroomClientSelector);
  const [showAskForPermission, setShowAskForPermission] = useState(false);
  const [backdrop, setBackdrop] = React.useState('static');
  const dispatch = useDispatch();
  const dataDetail = useSelector(dataDetailClassroomClientSelector);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const [idEditStudent, setIdEditStudent] = React.useState({
    student_code: 0,
    classroom_id: 0,
    week: 0,
    lesson: 0,
    status: 0,
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(addAskHistoryPermission),
  });

  const backToPage = () => {
    // props.isDetailClassroom = true;
    dispatch(
      setIsDetailClassroomClient({
        ...isDetailClassroom,
        checkDetail: false,
      })
    );
    dispatch(setIsScanQR(false));
    dispatch(setIsAttendanceClient(false));
  };
  const handleScanQR = () => {
    BlockUICLIENT('#root', 'fixed');
    dispatch(setIsScanQR(true));
    dispatch(
      setIsDetailClassroomClient({
        ...isDetailClassroom,
        checkDetail: false,
      })
    );
    dispatch(setIsAttendanceClient(false));

    Notiflix.Block.remove('#root');
  };
  const handleAskForPermission = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    const dataCreate = {
      class_code: data.class_code,
      number_roll_call: Number(data.number_roll_call),
      number_lesson_week: Number(data.number_lesson_week),
      reason: data.reason,
      status: 0,
    };
    const result = await createAskPermissionClient(dataCreate);
    if (result === 200) {
      SuccessToast('Tạo yêu cầu nghỉ phép thành công', 3500);
      Notiflix.Block.remove('.sl-box');
      // handleGetAllClassroom();
      setShowAskForPermission(false);
      reset();
    } else if (result === 400) {
      ErrorToast('Đơn xin nghỉ phép bạn tạo đã có trên hệ thống', 3500);
      Notiflix.Block.remove('.sl-box');
    } else {
      ErrorToast('Có lỗi xảy ra vui lòng thử lại', 3500);
      Notiflix.Block.remove('.sl-box');
    }
    Notiflix.Block.remove('#root');
  };
  const renderBody = () => {
    return (
      <>
        <Form onSubmit={handleSubmit(handleAskForPermission)} encType="multipart/form-data">
          <div className="row">
            <div className="row p-5">
              <div className="col md-6">
                <Form.Group className=" mb-3">
                  <div className="cp-input">
                    <p className="font-weight-bold">MSSV</p>
                    <Form.Control
                      {...register('student_code')}
                      type="text"
                      maxLength={128}
                      value={dataDetail.data.student_code}
                      disabled
                    />
                    {/* <small className="text-danger font-weight-bold">{errors?.student_code?.message}</small> */}
                  </div>
                </Form.Group>
                <Form.Group className=" mb-3">
                  <div className="cp-input">
                    <p className="font-weight-bold">Họ và Tên</p>
                    <Form.Control
                      type="text"
                      min={1}
                      max={20}
                      value={dataDetail.data.first_name + ' ' + dataDetail.data.last_name}
                      disabled
                    />
                    {/* <small className="text-danger font-weight-bold">{errors?.last_name?.message}</small> */}
                  </div>
                </Form.Group>
                <Form.Group className=" mb-3">
                  <div className="cp-input">
                    <p className="font-weight-bold">
                      Chọn tuần nghỉ <span className="text-danger">*</span>
                    </p>
                    <Form.Select
                      aria-label="Default select example"
                      name="number_roll_call"
                      {...register('number_lesson_week')}
                      onChange={(e) => setValue('number_lesson_week', e.target.value)}
                      // value={watch('number_lesson_week')}
                    >
                      <option value={0}>Chọn tuần...</option>
                      {(() => {
                        const divs = Array.from({ length: dataDetail.numberRollCall }, (_, index) => (
                          <option value={index + 1} key={index}>
                            Tuần {index + 1}
                          </option>
                        ));
                        return divs;
                      })()}
                    </Form.Select>
                    <small className="text-danger font-weight-bold">{errors?.number_lesson_week?.message}</small>
                  </div>
                </Form.Group>
                <Form.Group className=" mb-3">
                  <div className="cp-input">
                    <p className="font-weight-bold">
                      Chọn buổi nghỉ <span className="text-danger">*</span>
                    </p>
                    <Form.Select
                      aria-label="Default select example"
                      name="number_lesson"
                      {...register('number_roll_call')}
                      onChange={(e) => setValue('number_roll_call', e.target.value)}
                      // value={watch('number_roll_call')}
                    >
                      <option value={0}>Chọn buổi nghỉ...</option>
                      {(() => {
                        const divs = Array.from({ length: dataDetail.numberLessonWeek }, (_, index) => (
                          <option value={index + 1} key={index}>
                            Tiết thứ {index + 1} trong tuần
                          </option>
                        ));
                        return divs;
                      })()}
                    </Form.Select>
                    <small className="text-danger font-weight-bold">{errors?.number_roll_call?.message}</small>
                  </div>
                </Form.Group>
                <Form.Group className=" mb-3">
                  <div className="cp-input">
                    <p className="font-weight-bold">
                      Lý do <span className="text-danger">*</span>
                    </p>
                    <Form.Control as="textarea" rows={3} placeholder="Nhập lý do..." {...register('reason')} />
                    <small className="text-danger font-weight-bold">{errors?.reason?.message}</small>
                  </div>
                </Form.Group>
                <Form.Control value={isDetailClassroom.classCode} {...register('class_code')} hidden />
              </div>
            </div>
          </div>
          <div className="row pb-2">
            <Form.Group className="d-flex justify-content-center">
              <Button type="submit" variant="info" className="me-3 font-weight-bold">
                Tạo yêu cầu
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="font-weight-bold"
                onClick={() => setShowAskForPermission(false)}
              >
                Quay lại
              </Button>
            </Form.Group>
          </div>
        </Form>
      </>
    );
  };
  const columns = [
    // {
    //   title: 'STT',
    //   dataIndex: 'STT',
    //   key: 'STT',
    //   width: 100,
    //   fixed: 'left',
    // },
    {
      title: 'MSSV',
      dataIndex: 'student_code',
      key: 'MSSV',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'TÊN SINH VIÊN',
      dataIndex: 'full_name',
      key: 'TENSV',
      width: 200,
    },
    ...Array.from({ length: dataDetail.numberRollCall }, (_, i) => ({
      //so tuan
      title: `Tuần ${i + 1}`,
      dataIndex: `week${i + 1}`,
      key: `week${i + 1}`,
      width: 100,
      render: (_, record) => {
        // console.log('a', record.attendances[0][0]['week']);

        const divs = Array.from({ length: dataDetail.numberLessonWeek }, (_, index) => {
          const attendance = record.attendances.find((a) => a.week == i + 1 && a.lesson == index + 1);
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
      width: 100,
    },
  ];

  const data = [
    {
      key: dataDetail !== undefined && dataDetail.data.id,
      // STT: '-',
      student_code: dataDetail !== undefined && dataDetail.data.student_code,
      full_name: dataDetail !== undefined && dataDetail.data.last_name + ' ' + dataDetail.data.first_name,
      attendances: dataDetail !== undefined && dataDetail.data.attendances,
      score: <span style={{ marginLeft: '30%', fontWeight: '700' }}>{Number(dataDetail.data.score).toFixed(2)}</span>,
    },
  ];

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

  // Mobile

  const renderMobileTable = () => {
    return (
      <List
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={`list_item_${item.student_code}`}>
            <div>
              {/* <h3>STT: {item.STT}</h3> */}
              <h5>MSSV: {item.student_code}</h5>
              <h5>Tên sinh viên: {item.full_name}</h5>
              {Array.from({ length: dataDetail.numberRollCall }, (_, i) => {
                const attendanceColumns = Array.from({ length: dataDetail.numberLessonWeek }, (_, index) => {
                  const attendance = item.attendances.find((a) => a.week == i + 1 && a.lesson == index + 1);

                  const checked = attendance && attendance.status === '0';
                  return (
                    <p
                      key={`attendance_${i}_${index}`}
                      style={{
                        // textAlign: 'center',
                        // width: 90 / dataDetail.numberLessonWeek,
                        // height: 90 / dataDetail.numberLessonWeek,
                        // border: '1px solid',
                        marginLeft1: '10px',
                      }}
                    >
                      <Checkbox checked={checked} style={{ marginLeft: '10px' }} />
                    </p>
                  );
                });
                return (
                  <div className="d-flex mb-2" key={`week_${i}`}>
                    <h5 style={{ width: '100px' }}>Tuần {i + 1}</h5>
                    <div className="d-flex ml-2" style={{ margin: 'auto 0px' }}>
                      {attendanceColumns}
                    </div>
                  </div>
                );
              })}
              <h5>ĐIỂM: {item.score}</h5>
            </div>
          </List.Item>
        )}
      />
    );
  };

  const renderDesktopTable = () => {
    return (
      <Table
        columns={columns}
        dataSource={data.map((item, index) => ({ ...item, key: index }))}
        scroll={{ x: 'max-content', y: 300 }}
        // pagination={{ pageSize: 40 }}
        pagination={false}
      />
    );
  };

  return (
    <>
      <div className="row mb-3 justify-content-start ">
        <div className="row justify-content-between">
          <div className="col-md-4 col-sm-12 mt-2 ">
            <div className="d-flex">
              Mã lớp:
              <span className="font-weight-bold  padding-left-12px"> {isDetailClassroom.classCode}</span>
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
          <div className="col-md-8 col-sm-12 justify-content-between mt-2 ">
            <div className="d-flex justify-content-end">
              <Button
                id="create-new-product"
                variant="outline-info"
                className="font-weight-bold ms-3 m-r-15"
                onClick={() => handleScanQR()}
                size="sm"
              >
                Điểm danh QR
              </Button>
              <Button
                id="create-new-product"
                variant="outline-success"
                className="font-weight-bold ms-3 m-r-15"
                onClick={() => setShowAskForPermission(true)}
                size="sm"
              >
                Xin phép nghỉ học
              </Button>
              <Button
                id="create-new-product"
                variant="outline-secondary"
                className="font-weight-bold ms-3 m-r-15"
                onClick={() => backToPage()}
                size="sm"
              >
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* *** */}
      <div style={{ overflow: 'scroll' }}>
        {isMobile ? renderMobileTable() : renderDesktopTable()}
        {/* <Table
          columns={columns}
          dataSource={data.map((item, index) => ({ ...item, key: index }))}
          scroll={{ x: 'max-content', y: 300 }}
          pagination={{ pageSize: 40 }}
        /> */}
      </div>

      <div className="row mt-5">
        <h4 className="header-notification">Thông báo</h4>
        <NotificationClient />
      </div>

      {/* **** */}

      <Modal
        show={showAskForPermission}
        backdrop={backdrop}
        setStateModal={() => setShowAskForPermission()}
        elementModalTitle={<p>Xin phép nghỉ học</p>}
        elementModalBody={renderBody()}
      />
    </>
  );
}
