// @flow
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getAllClassroomClient } from '../../../api/Client/Classroom/classroomClientAPI';
import { ClientOverview } from '../../../components/Client/Overview';
import { DetailClassroomClientTable } from '../../../components/Client/Overview/DetailClassroom';
import Attendance from '../../../components/Client/Overview/DetailClassroom/Attendance';
import ScanQRCode from '../../../components/Client/Overview/DetailClassroom/ScanQRCode';
import JoinClassroom from '../../../components/Client/Overview/JoinClassroom';
import PaginationUI from '../../../components/Layouts/Pagination';
import {
  isAttendanceClientSelector,
  isDetailClassroomClientSelector,
  isScanQRClassroomSelector,
} from '../../../redux/selectors/classroom/classroom.selector';
import Notiflix from 'notiflix';
import { ErrorToast } from '../../../components/Layouts/Alerts';

export function ClientOverviewPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(11);
  const [show, setShowJoin] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  // const [isDetailClassroom, setIsDetailClassroom] = React.useState(false);
  const isDetailClassroomClient = useSelector(isDetailClassroomClientSelector);
  const isScanQRClassroom = useSelector(isScanQRClassroomSelector);
  const isAttendance = useSelector(isAttendanceClientSelector);
  const [search, setSearch] = React.useState('');
  const setClassroom = (result, value) => {
    setData(result.data);
    if (value !== 'page') {
      setPage(1);
    }
    setTotalRecords(result.total);
    // setTotalPage(result.meta.last_page);
  };
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
  React.useEffect(() => {
    handleGetAllClassroomClient();
  }, [dispatch]);

  const handlePageChange = async (page) => {
    setPage(page);
    const result = await getAllClassroomClient({
      page,
    });
    if (result === 401) {
    } else if (result === 500) {
      return false;
    } else {
      setClassroom(result, 'page');
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (search !== '') {
      const result = await getAllClassroomClient({
        page: page,
        search,
      });
      if (result === 401) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else if (result === 500) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else {
        setClassroom(result, 'page');
      }

      Notiflix.Block.remove('#root');
    } else {
      const result = await getAllClassroomClient({
        page: page,
      });
      if (result === 401) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else if (result === 500) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else {
        setClassroom(result, 'page');
      }

      Notiflix.Block.remove('#root');
    }
  };
  console.log(isDetailClassroomClient, isScanQRClassroom, isAttendance);
  return (
    <>
      <section>
        <div className="container-fluid mt-5">
          <h5 className="font-weight-bold mb-3">Danh sách lớp học</h5>

          {!isDetailClassroomClient.checkDetail && !isScanQRClassroom && !isAttendance && (
            <div className="row">
              <div className="row mb-5 justify-content-end ">
                <div className="d-flex justify-content-between">
                  <div className="d-flex  "></div>
                  <div className="d-flex justify-content-between ">
                    <Form onSubmit={(e) => handleSearch(e)}>
                      <InputGroup>
                        <Form.Control
                          id="search-order"
                          placeholder="Nhập mã lớp để tìm kiếm"
                          onChange={(e) => setSearch(e.target.value)}
                        />

                        <Button id="search-user" variant="info" type="submit">
                          <FaSearch />
                        </Button>
                      </InputGroup>
                    </Form>
                    <Button
                      id="create-new-product"
                      variant="info"
                      className="font-weight-bold ms-3 m-r-15"
                      onClick={() => setShowJoin(true)}
                    >
                      Tham gia lớp
                    </Button>
                  </div>
                </div>
              </div>
              <ClientOverview data={data} />
              {totalRecord > 10 && (
                <PaginationUI handlePageChange={handlePageChange} perPage={10} totalRecord={200} currentPage={1} />
              )}
            </div>
          )}
        </div>
        {isDetailClassroomClient.checkDetail && !isAttendance && !isScanQRClassroom && <DetailClassroomClientTable />}

        {!isDetailClassroomClient.checkDetail && !isAttendance && isScanQRClassroom && <ScanQRCode />}
        {!isDetailClassroomClient.checkDetail && !isScanQRClassroom && isAttendance && <Attendance />}

        <JoinClassroom
          show={show}
          setStateModal={() => setShowJoin(false)}
          handleGetAllClassroomClient={handleGetAllClassroomClient}
        />
      </section>
    </>
  );
}
