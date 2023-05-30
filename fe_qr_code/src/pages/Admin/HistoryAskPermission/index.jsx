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
import { ClientHistoryPermission } from '../../../components/Client/HistoryAskPermission';
import { getAllHistoryAskPerClient } from '../../../api/Client/HistoryAskPermission/historyPermissionClientAPI';
import { AdminHistoryPermission } from '../../../components/Admin/HistoryAskPermission';
import { getAllHistoryAskPermission } from '../../../api/Admin/HistoryAskPermission/historyPermissionAdminAPI';
import { isDetailHistoryAskPermissionSelector } from '../../../redux/selectors/history_ask_permission/historyaskpermission.selector';
import { AdminHistoryPermissionDetail } from '../../../components/Admin/HistoryAskPermission/DetailAskPermission';
import { setIsDetailHistoryAskPermission } from '../../../redux/reducer/history_ask_permistion/historyaskpermission.reducer';

export function AdminHistoryPermissionPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(11);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const isDetailHistoryAskPermission = useSelector(isDetailHistoryAskPermissionSelector);
  const setHistory = (result, value) => {
    setData(result.data);
    if (value !== 'page') {
      setPage(1);
    }
    setTotalRecords(result.total);
    // setTotalPage(result.meta.last_page);
  };
  const handleGetAllHistoryPermissionAdmin = async () => {
    const result = await getAllHistoryAskPermission({
      key: 'id',
      value: 'asc',
    });

    if (result === 401) {
      return false;
    } else if (result === 500) {
      return false;
    } else {
      setHistory(result);
    }
  };
  React.useEffect(() => {
    handleGetAllHistoryPermissionAdmin();
  }, [dispatch]);

  const handlePageChange = async (page) => {
    setPage(page);
    const result = await getAllHistoryAskPermission({
      page,
    });
    if (result === 401) {
    } else if (result === 500) {
      return false;
    } else {
      setHistory(result, 'page');
    }
  };
  const handleSearch = async (e) => {
    e.preventDefault();
    if (search !== '') {
      const result = await getAllHistoryAskPermission({
        page: page,
        search,
      });
      if (result === 401) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else if (result === 500) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else {
        setHistory(result, 'page');
      }

      Notiflix.Block.remove('#root');
    } else {
      const result = await getAllHistoryAskPermission({
        page: page,
      });
      if (result === 401) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else if (result === 500) {
        ErrorToast('Something went wrong. Please try again', 3000);
      } else {
        setHistory(result, 'page');
      }

      Notiflix.Block.remove('#root');
    }
  };
  console.log('fh', isDetailHistoryAskPermission);

  return (
    <>
      <section>
        {!isDetailHistoryAskPermission.isDetail && (
          <div className="container-fluid mt-5">
            <h5 className="font-weight-bold mb-3">Danh sách đơn nghỉ phép</h5>
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
                          size="sm"
                        />

                        <Button id="search-user" variant="info" type="submit" size="sm">
                          <FaSearch />
                        </Button>
                      </InputGroup>
                    </Form>
                  </div>
                </div>
              </div>
              <AdminHistoryPermission data={data} />
              {/* {totalRecord > 10 && (
                <PaginationUI handlePageChange={handlePageChange} perPage={10} totalRecord={200} currentPage={1} />
              )} */}
            </div>
          </div>
        )}

        {isDetailHistoryAskPermission.isDetail && (
          <div className="container-fluid mt-5">
            <h5 className="font-weight-bold mb-3">Chi tiết danh sách đơn nghỉ phép </h5>
            <h6 className="font-weight-bold mb-3">Tên lớp : {isDetailHistoryAskPermission.classroom}</h6>
            <div className="row">
              <AdminHistoryPermissionDetail data={data} />
              {/* {totalRecord > 10 && (
                <PaginationUI handlePageChange={handlePageChange} perPage={10} totalRecord={200} currentPage={1} />
              )} */}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
