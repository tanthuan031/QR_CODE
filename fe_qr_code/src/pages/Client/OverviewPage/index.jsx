// @flow
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaFileExcel, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { ClassRoom } from '../../../components/Admin/Classroom';
import CreateClassroom from '../../../components/Admin/Classroom/CreateClassroom';
import { DetailClassroomTable } from '../../../components/Admin/Classroom/DetailClassroom';
import QRCodeGenerator from '../../../components/Admin/Classroom/DetailClassroom/QRCode';
import { ClientOverview } from '../../../components/Client/Overview';
import Modal from '../../../components/Layouts/Modal';
import PaginationUI from '../../../components/Layouts/Pagination';
import { setIsDetailClassroom, setIsQR } from '../../../redux/reducer/classroom/classroom.reducer';
import {
  isDetailClassroomSelector,
  isQRClassroomSelector,
} from '../../../redux/selectors/classroom/classroom.selector';

export function ClientOverviewPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(11);
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

  return (
    <>
      <section>
        <div className="container-fluid mt-5">
          <h5 className="font-weight-bold mb-3">Class Room</h5>

          {!isDetailClassroom && !isQRClassroom && (
            <div className="row">
              <ClientOverview />
              {totalRecord > 10 && (
                <PaginationUI
                  // handlePageChange={handlePageChange}
                  perPage={10}
                  totalRecord={200}
                  currentPage={1}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
