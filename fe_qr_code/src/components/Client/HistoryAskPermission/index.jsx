// @flow
import * as React from 'react';
import { Button as ButtonReact, Form, InputGroup } from 'react-bootstrap';
import { FaEdit, FaEye, FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import {
  setDataDetailClassroomClient,
  setIsAttendanceClient,
  setIsDetailClassroom,
  setIsDetailClassroomClient,
} from '../../../redux/reducer/classroom/classroom.reducer';

import './style.css';
import { detailClassroomStudentClient } from '../../../api/Client/Classroom/classroomClientAPI';
import { BlockUICLIENT } from '../../Layouts/Notiflix';
import Notiflix from 'notiflix';
import { Button, Table } from 'antd';
import { formatDate } from '../../../utils/formatDate';
import Modal from '../../Layouts/Modal';
import { useForm } from 'react-hook-form';
import { updateAskPermissionClient } from '../../../api/Client/HistoryAskPermission/historyPermissionClientAPI';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
export function ClientHistoryPermission(props) {
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
  const [showAskPermission, setShowAskPermission] = React.useState(false);
  const [idUpdateAskPer, setIdUpdateAskPer] = React.useState();
  const [backdrop, setBackdrop] = React.useState('static');

  const columns = [
    {
      title: 'STT',
      width: 50,
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
      // width: 100,
      sorter: true,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'class_name',
      key: 'class_name',
      render: (text, record, index) => record.classrooms[0].class_name,
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
      // width: 200,
      key: 'reason',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      // width: 150,
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
          return <span className="text-info text-bold">Yêu cầu đã hủy</span>;
        } else {
          return <span className="text-danger text-bold">Từ chối</span>;
        }
      },
    },
    {
      title: 'Action',
      key: 'operation',
      // fixed: 'right',
      width: 70,
      render: (record) => (
        <Button
          id="edit-product"
          onClick={() => handleUpdateAskPermission(record)}
          disabled={record.status == 1 || record.status == 2 || record.status == 3 ? true : false}
          size={'small'}
          danger
          // style={{ marginLeft: '40%' }}
        >
          Hủy
        </Button>
      ),
    },
  ];
  // console.log('dât', props.data);
  const data = props.data;
  const setStateModalAskPermission = () => {
    setShowAskPermission(false);
  };

  const onSubmitUpdateAskPermission = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    if (idUpdateAskPer !== undefined) {
      const dataUpdate = {
        status: Number(data.status),
      };
      const result = await updateAskPermissionClient(idUpdateAskPer, dataUpdate);
      if (result === 200) {
        SuccessToast('Cập nhật trạng thái thành công', 3500);
        Notiflix.Block.remove('.sl-box');
        // handleGetAllClassroom();
        props.onSubmitUpdateAskPermission();
        setShowAskPermission(false);
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
                <p className="font-weight-bold">Bạn xác nhận hủy yêu cầu ?</p>
                <Form.Select
                  hidden
                  aria-label="Default select example"
                  name="status"
                  {...register('status')}
                  onChange={(e) => setValue('status', e.target.value)}
                >
                  <option value={3}>Hủy</option>
                </Form.Select>
                <small className="text-danger font-weight-bold"></small>
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row pb-3">
          <Form.Group className="d-flex justify-content-center">
            <ButtonReact type="submit" variant="info" className="me-3 font-weight-bold">
              Ok
            </ButtonReact>
            <ButtonReact
              type="button"
              variant="secondary"
              className="font-weight-bold"
              onClick={() => setShowAskPermission(false)}
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
  return (
    <>
      <div className="row ">
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="small"
          scroll={{ x: 'calc(500px + 50%)', y: 400 }}
          pagination={false}
        />
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
