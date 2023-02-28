// @flow
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaFileExcel, FaSearch } from 'react-icons/fa';
import { ClassRoom } from '../../../components/Admin/Classroom';
import CreateClassroom from '../../../components/Admin/Classroom/CreateClassroom';
import { DetailClassroomTable } from '../../../components/Admin/Classroom/DetailClassroom';
import Modal from '../../../components/Layouts/Modal';
import PaginationUI from '../../../components/Layouts/Pagination';

export function ClassroomPage() {
  const [totalRecord, setTotalRecords] = React.useState(11);

  const [isDetailClassroom, setIsDetailClassroom] = React.useState(true);
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

          {!isDetailClassroom && (
            <div className="row">
              <ClassRoom />
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
        {/* <Modal setStateModal={() => setShowCreate(false)} show={show} elementModalBody={bodyModalCreateClass()} /> */}

        {isDetailClassroom && (
          <DetailClassroomTable tableBody={dataTableBody} tableHeader={dataHeaderDetailClassroom} />
        )}
      </section>
    </>
  );
}
