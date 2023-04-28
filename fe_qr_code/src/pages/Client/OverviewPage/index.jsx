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
  isDetailClassroomClientSelector,
  isDetailClassroomSelector,
  isQRClassroomSelector,
  isScanQRClassroomSelector,
} from '../../../redux/selectors/classroom/classroom.selector';
import { getAllClassroomClient } from '../../../api/Client/Classroom/classroomClientAPI';
import { DetailClassroomClientTable } from '../../../components/Client/Overview/DetailClassroom';
import ScanQRCode from '../../../components/Client/Overview/DetailClassroom/ScanQRCode';

export function ClientOverviewPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(11);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  // const [isDetailClassroom, setIsDetailClassroom] = React.useState(false);
  const isDetailClassroomClient = useSelector(isDetailClassroomClientSelector);
  const isScanQRClassroom = useSelector(isScanQRClassroomSelector);
  React.useEffect(() => {
    const handleGetAllClassroomClient = async () => {
      const result = await getAllClassroomClient({
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
    handleGetAllClassroomClient();
  }, [dispatch]);
  const setClassroom = (result, value) => {
    setData(result.data);
    if (value !== 'page') {
      setPage(1);
    }
    setTotalRecords(result.total);
    // setTotalPage(result.meta.last_page);
  };
  return (
    <>
      <section>
        <div className="container-fluid mt-5">
          <h5 className="font-weight-bold mb-3">Danh sách lớp học</h5>

          {!isDetailClassroomClient && !isScanQRClassroom && (
            <div className="row">
              <ClientOverview data={data} />
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
        {isDetailClassroomClient.checkDetail && !isScanQRClassroom && <DetailClassroomClientTable />}
        {!isDetailClassroomClient.checkDetail && isScanQRClassroom && <ScanQRCode />}
      </section>
    </>
  );
}
