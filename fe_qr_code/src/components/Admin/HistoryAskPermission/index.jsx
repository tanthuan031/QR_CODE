// @flow
import * as React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
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
import { getAllDetailHistoryAskPermission } from '../../../api/Admin/HistoryAskPermission/historyPermissionAdminAPI';
import {
  setDataDetailHistoryAskPermission,
  setIsDetailHistoryAskPermission,
} from '../../../redux/reducer/history_ask_permistion/historyaskpermission.reducer';
import { ErrorToast } from '../../Layouts/Alerts';
export function AdminHistoryPermission(props) {
  const dispatch = useDispatch();
  const [dataHistoryPermission, setDataHistoryPermission] = React.useState([]);

  const handleDetailHistoryAsk = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    const result = await getAllDetailHistoryAskPermission({
      classCode: data.class_code,
      sort: [{ key: 'status', value: 'asc' }],
    });

    if (result === 401) {
      return false;
    } else if (result === 500) {
      ErrorToast('Hệ thống đang bảo trì. Vui lòng quay lại sau', 3000);
      // window.location.href = '/';
    } else {
      dispatch(
        setIsDetailHistoryAskPermission({
          isDetail: true,
          classroom: data.classrooms[0].class_name,
          classCode: data.classrooms[0].class_code,
        })
      );
      dispatch(setDataDetailHistoryAskPermission(result.data));
    }
    Notiflix.Block.remove('#root');
  };

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
      sorter: true,
    },
    {
      title: 'Tên lớp',
      dataIndex: 'class_name',
      key: 'class_name',
      render: (text, record, index) => record.classrooms[0].class_name,
    },

    {
      title: 'Action',
      key: 'operation',
      // fixed: 'right',
      // width: 100,
      render: (record) => (
        <Button
          id="edit-product"
          onClick={() => handleDetailHistoryAsk(record)}
          size="small"
          style={{
            color: '#0dcaf0',
            borderColor: '#0dcaf0',
          }}
          // style={{ marginLeft: '40%' }}
        >
          Xem
        </Button>
      ),
    },
  ];
  // console.log('dât', props.data);
  const data = props.data;
  return (
    <>
      <div className="row ">
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="small"
          scroll={{ x: 'calc(500px + 50%)', y: 240 }}
          pagination={false}
        />
      </div>
    </>
  );
}
