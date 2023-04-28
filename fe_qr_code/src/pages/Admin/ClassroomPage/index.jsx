// @flow
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaFileExcel, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { ClassRoom } from '../../../components/Admin/Classroom';
import CreateClassroom from '../../../components/Admin/Classroom/CreateClassroom';
import { DetailClassroomTable } from '../../../components/Admin/Classroom/DetailClassroom';
import QRCodeGenerator from '../../../components/Admin/Classroom/DetailClassroom/QRCode';
import Modal from '../../../components/Layouts/Modal';
import PaginationUI from '../../../components/Layouts/Pagination';
import { setIsDetailClassroom, setIsQR } from '../../../redux/reducer/classroom/classroom.reducer';
import {
  dataDetailClassroomSelector,
  isDetailClassroomSelector,
  isQRClassroomSelector,
} from '../../../redux/selectors/classroom/classroom.selector';
import { getAllClassroom } from '../../../api/Admin/Classroom/classroomAPI';
import { configureStore } from '@reduxjs/toolkit';

export function ClassroomPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(11);
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  // const [isDetailClassroom, setIsDetailClassroom] = React.useState(false);
  const isDetailClassroom = useSelector(isDetailClassroomSelector);
  const isQRClassroom = useSelector(isQRClassroomSelector);
  const dataTableBody = [];
  const dataHeaderDetailClassroom = [
    {
      id: 1,
      name: 'STT',
    },
    {
      id: 2,
      name: 'MSSV',
    },
    {
      id: 3,
      name: 'Tên SV',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
    {
      id: 4,
      name: 'Tuần 1',
    },
  ];

  React.useEffect(() => {
    const handleGetAllClassroom = async () => {
      const result = await getAllClassroom({
        key: 'id',
        value: 'asc',
      });

      if (result === 401) {
        return false;
      } else if (result === 500) {
        return false;
      } else {
        setClassroom(result);
      }
    };
    handleGetAllClassroom();
  }, [dispatch]);
  const setClassroom = (result, value) => {
    setData(result.data);
    if (value !== 'page') {
      setPage(1);
    }
    setTotalRecords(result.total);
    // setTotalPage(result.meta.last_page);
  };
  const handlePageChange = async (page) => {
    setPage(page);
    const result = await getAllClassroom({
      page,
    });
    if (result === 401) {
    } else if (result === 500) {
      return false;
    } else {
      setClassroom(result, 'page');
    }
  };

  return (
    <>
      <section>
        <div className="container-fluid mt-5">
          <h5 className="font-weight-bold mb-3">Danh sách lớp học</h5>

          {!isDetailClassroom.checkDetail && !isQRClassroom && (
            <div className="row">
              <ClassRoom data={data} />
              {totalRecord > 10 && (
                <PaginationUI
                  handlePageChange={handlePageChange}
                  perPage={8}
                  totalRecord={totalRecord}
                  currentPage={page}
                />
              )}
            </div>
          )}
        </div>
        {/* <Modal setStateModal={() => setShowCreate(false)} show={show} elementModalBody={bodyModalCreateClass()} /> */}

        {isDetailClassroom.checkDetail && !isQRClassroom && (
          <DetailClassroomTable
          // isDetailClassroom.checkDetail={}
          />
        )}

        {!isDetailClassroom.checkDetail && isQRClassroom && <QRCodeGenerator />}
      </section>
    </>
  );
}
