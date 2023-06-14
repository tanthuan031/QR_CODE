// @flow
import Notiflix from 'notiflix';
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
import { ErrorToast } from '../../../components/Layouts/Alerts';
import NotFoundData from '../../../components/Layouts/NotFoundData';
import PaginationUI from '../../../components/Layouts/Pagination';
import Skeleton from '../../../components/Layouts/Skeleton';
import {
  isAttendanceClientSelector,
  isDetailClassroomClientSelector,
  isScanQRClassroomSelector,
} from '../../../redux/selectors/classroom/classroom.selector';

export function ClientOverviewPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(11);
  const [show, setShowJoin] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
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
      sort: [
        {
          key: 'class_name',
          value: 'asc',
        },
      ],
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
    setLoading(true);
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
    setLoading(false);
  };
  return (
    <>
      <section>
        <div className="container-fluid mt-5">
          {!isDetailClassroomClient.checkDetail && !isScanQRClassroom && !isAttendance && (
            <>
              <h5 className="font-weight-bold mb-3">Danh sách lớp học</h5>
              <div className="row">
                <div className="row mb-4 justify-content-end ">
                  <div className="row">
                    <div className="col-md-8 col-sm-12 mb-2 order-sm-1 order-2">
                      <Button
                        id="create-new-product"
                        variant="outline-success"
                        size="sm"
                        className="font-weight-bold  m-r-15 "
                        onClick={() => setShowJoin(true)}
                      >
                        Tham gia lớp
                      </Button>
                    </div>
                    <div className="col-md-4 col-sm-12 mb-2 order-sm-2 order-1">
                      <Form onSubmit={(e) => handleSearch(e)}>
                        <InputGroup>
                          <Form.Control
                            id="search-order"
                            placeholder="Nhập mã/tên lớp để tìm kiếm..."
                            onChange={(e) => setSearch(e.target.value)}
                            size="sm"
                          />

                          <Button
                            id="search-user"
                            variant="info"
                            type="submit"
                            // style={{ backgroundColor: 'linear-gradient(to right, #20ec9e, #0260ec) !important' }}
                          >
                            <FaSearch />
                          </Button>
                        </InputGroup>
                      </Form>
                    </div>
                  </div>
                </div>
                {loading === true ? (
                  <Skeleton column={4} />
                ) : data.length > 0 ? (
                  <ClientOverview data={data} />
                ) : (
                  <NotFoundData />
                )}
                {totalRecord > 10 && (
                  <PaginationUI handlePageChange={handlePageChange} perPage={10} totalRecord={200} currentPage={1} />
                )}
              </div>
            </>
          )}
        </div>
        {isDetailClassroomClient.checkDetail && !isAttendance && !isScanQRClassroom && (
          <>
            <h5 className="font-weight-bold mb-3">Chi tiết lớp học</h5>
            <DetailClassroomClientTable />
          </>
        )}

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
