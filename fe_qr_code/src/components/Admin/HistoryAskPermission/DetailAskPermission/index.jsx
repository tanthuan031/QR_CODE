// @flow
import * as React from 'react';
import { Button as ButtonReact, Form, InputGroup } from 'react-bootstrap';
import { FaEdit, FaEye, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDataDetailClassroomClient,
  setIsAttendanceClient,
  setIsDetailClassroom,
  setIsDetailClassroomClient,
} from '../../../../redux/reducer/classroom/classroom.reducer';

import './style.css';
import { detailClassroomStudentClient } from '../../../../api/Client/Classroom/classroomClientAPI';
import { BlockUICLIENT } from '../../../Layouts/Notiflix';
import Notiflix from 'notiflix';
import { Button, Table } from 'antd';
import { formatDate } from '../../../../utils/formatDate';
import {
  dataDetailHistoryAskPermissionSelector,
  isDetailHistoryAskPermissionSelector,
} from '../../../../redux/selectors/history_ask_permission/historyaskpermission.selector';
import { ErrorToast, SuccessToast } from '../../../Layouts/Alerts';
import {
  getAllDetailHistoryAskPermission,
  updateAskPermissionAdmin,
} from '../../../../api/Admin/HistoryAskPermission/historyPermissionAdminAPI';
import {
  setDataDetailHistoryAskPermission,
  setIsDetailHistoryAskPermission,
} from '../../../../redux/reducer/history_ask_permistion/historyaskpermission.reducer';
import Modal from '../../../Layouts/Modal';
import { useForm } from 'react-hook-form';
export function AdminHistoryPermissionDetail(props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    //  resolver: yupResolver(addSchemaStudent),
  });

  const dispatch = useDispatch();
  const [dataHistoryPermission, setDataHistoryPermission] = React.useState([]);
  const dataDetailHis = useSelector(dataDetailHistoryAskPermissionSelector);
  const isDetailHis = useSelector(isDetailHistoryAskPermissionSelector);
  const [search, setSearch] = React.useState('');
  const [showAskPermission, setShowAskPermission] = React.useState(false);
  const [idUpdateAskPer, setIdUpdateAskPer] = React.useState();
  const [backdrop, setBackdrop] = React.useState('static');
  console.log(dataDetailHis);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (search !== '') {
      const result = await getAllDetailHistoryAskPermission({
        classCode: isDetailHis.classCode,
        search: search,
      });
      if (result === 401) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else if (result === 500) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else {
        dispatch(setDataDetailHistoryAskPermission(result.data));
      }

      Notiflix.Block.remove('#root');
    } else {
      const result = await getAllDetailHistoryAskPermission({
        classCode: isDetailHis.classCode,
      });
      if (result === 401) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else if (result === 500) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else {
        dispatch(setDataDetailHistoryAskPermission(result.data));
      }

      Notiflix.Block.remove('#root');
    }
  };

  const onSubmitUpdateAskPermission = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    if (idUpdateAskPer !== undefined) {
      const dataUpdate = {
        status: Number(data.status),
      };
      const result = await updateAskPermissionAdmin(idUpdateAskPer, dataUpdate);
      if (result === 200) {
        SuccessToast('Cập nhật trạng thái thành công', 3500);
        Notiflix.Block.remove('.sl-box');
        // handleGetAllClassroom();
        setShowAskPermission(false);
        const result = await getAllDetailHistoryAskPermission({
          classCode: isDetailHis.classCode,
        });
        if (result === 401) {
          ErrorToast('Something went wrong. Please try again', 3000);
        } else if (result === 500) {
          ErrorToast('Something went wrong. Please try again', 3000);
        } else {
          dispatch(setDataDetailHistoryAskPermission(result.data));
        }
      } else if (result === 400) {
        ErrorToast('Không tìm thấy yêu cầu cần cập nhật', 3500);
        Notiflix.Block.remove('.sl-box');
      } else {
        ErrorToast('Có lỗi xảy ra vui lòng thử lại', 3500);
        Notiflix.Block.remove('.sl-box');
      }
    } else {
      ErrorToast('Có lỗi xảy ra vui lòng thử lại', 3500);
      Notiflix.Block.remove('.sl-box');
    }
    Notiflix.Block.remove('#root');
  };
  const renderBodyAskPermission = () => {
    return (
      <Form onSubmit={handleSubmit(onSubmitUpdateAskPermission)} encType="multipart/form-data">
        <div className="row p-5">
          <div className="col md-6">
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Chọn trạng thái</p>
                <Form.Select
                  aria-label="Default select example"
                  name="status"
                  {...register('status')}
                  onChange={(e) => setValue('status', e.target.value)}
                >
                  <option value={1}>Xác nhận</option>
                  <option value={2}>Từ chối</option>
                </Form.Select>
                <small className="text-danger font-weight-bold"></small>
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row pb-3">
          <Form.Group className="d-flex justify-content-center">
            <ButtonReact type="submit" variant="info" className="me-3 font-weight-bold" size="sm">
              Cập nhật
            </ButtonReact>
            <ButtonReact
              type="button"
              variant="secondary"
              className="font-weight-bold"
              onClick={() => setShowAskPermission(false)}
              size="sm"
            >
              Quay lại
            </ButtonReact>
          </Form.Group>
        </div>
      </Form>
    );
  };
  const handleUpdateAskPermission = (data) => {
    setShowAskPermission(true);
    setIdUpdateAskPer(data.id);
  };
  const columns = [
    {
      title: 'STT',
      width: 60,
      dataIndex: 'key',
      key: 'key',
      // fixed: 'left',
      sorter: true,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Mã lớp',
      // width: 100,
      dataIndex: 'class_code',
      key: 'class_code',
      // fixed: 'left',
      sorter: true,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'class_name',
      key: 'class_name',
      render: (text, record, index) => record.classrooms[0].class_name,
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'student_code',
      width: 100,
      key: 'student_code',
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'users',
      key: 'users',
      render: (text, record, index) =>
        record.users.length > 0 && record.users[0].last_name + ' ' + record.users[0].first_name,
    },
    {
      title: 'Tuần',
      dataIndex: 'number_roll_call',
      key: 'number_roll_call',
    },

    {
      title: 'Buổi thứ trong tuần',
      dataIndex: 'number_lesson_week',
      key: 'number_lesson_week',
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      width: 200,
      key: 'reason',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text) => formatDate(text, 'DD-MM-YYYY HH:mm:ss'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text == 0) {
          return <span className="text-warning text-bold">Chờ duyệt</span>;
        } else if (text == 1) {
          return <span className="text-success text-bold">Chấp nhận</span>;
        } else if (text == 3) {
          return <span className="text-secondary text-bold">Yêu cầu đã bị hủy</span>;
        } else {
          return <span className="text-danger text-bold">Từ chối</span>;
        }
      },
    },
    {
      title: 'Action',
      key: 'operation',
      // fixed: 'right',
      width: 100,
      render: (record) => (
        <Button
          id="edit-product"
          onClick={() => handleUpdateAskPermission(record)}
          disabled={record.status == 1 || record.status == 2 || record.status == 3 ? true : false}
          size={'small'}
          danger
          // style={{ marginLeft: '40%' }}
        >
          Action
        </Button>
      ),
    },
  ];
  // console.log('dât', props.data);
  const data = dataDetailHis;
  const setStateModalAskPermission = () => {
    setShowAskPermission(false);
  };
  return (
    <>
      <div className="row mb-5 justify-content-end ">
        <div className="d-flex justify-content-between">
          <div className="d-flex  "></div>
          <div className="d-flex justify-content-between ">
            <Form onSubmit={(e) => handleSearch(e)}>
              <InputGroup>
                <Form.Control
                  id="search-order"
                  placeholder="Nhập mã sinh viên"
                  onChange={(e) => setSearch(e.target.value)}
                  size="sm"
                />

                <ButtonReact id="search-user" variant="info" type="submit" size="sm">
                  <FaSearch />
                </ButtonReact>
              </InputGroup>
            </Form>
            <ButtonReact
              id="create-new-product"
              variant="outline-secondary"
              className="font-weight-bold ms-3 m-r-15"
              size="sm"
              onClick={() =>
                dispatch(
                  setIsDetailHistoryAskPermission({
                    idDetail: false,
                    classroom: undefined,
                    classCode: undefined,
                  })
                )
              }
            >
              Quay lại
            </ButtonReact>
          </div>
        </div>
      </div>
      <div className="row ">
        <Table columns={columns} dataSource={data} bordered size="small" scroll={{ x: 'calc(500px + 50%)', y: 240 }} />
      </div>

      <Modal
        show={showAskPermission}
        backdrop={backdrop}
        setStateModal={() => setStateModalAskPermission()}
        elementModalTitle={<p>Cập nhật trạng thái nghỉ phép</p>}
        elementModalBody={renderBodyAskPermission()}
      />
    </>
  );
}
