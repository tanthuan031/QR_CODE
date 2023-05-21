import { yupResolver } from '@hookform/resolvers/yup';
import { Checkbox, Table } from 'antd';
import React from 'react';
import { Button } from 'react-bootstrap';
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

export function DetailClassroomClientTable(props) {
  const [show, setShow] = React.useState(false);
  const [showAddStudent, setShowAddStudent] = React.useState(false);
  const isDetailClassroom = useSelector(isDetailClassroomClientSelector);
  const [backdrop, setBackdrop] = React.useState('static');
  const dispatch = useDispatch();
  const dataDetail = useSelector(dataDetailClassroomClientSelector);
  console.log('DF', isDetailClassroom);
  const {
    register,
    handleSubmit,
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
    dispatch(setIsScanQR(true));
    dispatch(
      setIsDetailClassroomClient({
        ...isDetailClassroom,
        checkDetail: false,
      })
    );
    dispatch(setIsAttendanceClient(false));
  };
  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      width: 100,
      fixed: 'left',
    },
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
      fixed: 'left',
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
            <p style={{ textAlign: 'center', width: 90 / dataDetail.numberLessonWeek, border: '1px solid' }}>
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
      STT: '-',
      student_code: dataDetail !== undefined && dataDetail.data.student_code,
      full_name: dataDetail !== undefined && dataDetail.data.first_name + ' ' + dataDetail.data.last_name,
      attendances: dataDetail !== undefined && dataDetail.data.attendances,
      score: <span style={{ marginLeft: '30%', fontWeight: '700' }}>{Number(dataDetail.data.score).toFixed(2)}</span>,
    },
  ];
  return (
    <>
      <div className="row mb-5 justify-content-end ">
        <div className="d-flex justify-content-between">
          <div className="d-flex  ">
            Mã lớp:<span className="font-weight-bold  padding-left-12px"> {isDetailClassroom.classCode}</span>
          </div>
          <div className="d-flex justify-content-between ">
            <Button
              id="create-new-product"
              variant="info"
              className="font-weight-bold ms-3 m-r-15"
              onClick={() => handleScanQR()}
            >
              Điểm danh QR
            </Button>
            <Button
              id="create-new-product"
              variant="info"
              className="font-weight-bold ms-3 m-r-15"
              onClick={() => backToPage()}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
      {/* *** */}
      <div style={{ overflow: 'scroll' }}>
        <Table
          columns={columns}
          dataSource={data.map((item, index) => ({ ...item, key: index }))}
          scroll={{ x: 'max-content', y: 300 }}
          pagination={{ pageSize: 40 }}
        />
      </div>

      {/* **** */}
    </>
  );
}
