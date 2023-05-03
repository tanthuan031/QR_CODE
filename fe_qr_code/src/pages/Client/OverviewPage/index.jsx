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
import JoinClassroom from '../../../components/Client/Overview/JoinClassroom';

export function ClientOverviewPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(11);
  const [show, setShowJoin] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  // const [isDetailClassroom, setIsDetailClassroom] = React.useState(false);
  const isDetailClassroomClient = useSelector(isDetailClassroomClientSelector);
  const isScanQRClassroom = useSelector(isScanQRClassroomSelector);
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
              <div className="row mb-5 justify-content-end ">
                <div className="d-flex justify-content-between">
                  <div className="d-flex  "></div>
                  <div className="d-flex justify-content-between ">
                    <Form>
                      <InputGroup>
                        <Form.Control
                          id="search-order"
                          placeholder="Nhập mã lớp để tìm kiếm"
                          // onChange={(e) => setSearch(e.target.value)}
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

        <JoinClassroom
          show={show}
          setStateModal={() => setShowJoin(false)}
          handleGetAllClassroomClient={handleGetAllClassroomClient}
        />
      </section>
    </>
  );
}
