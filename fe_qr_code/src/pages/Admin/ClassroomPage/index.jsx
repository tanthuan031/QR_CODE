// @flow
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaFileExcel, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { ClassRoom } from '../../../components/Admin/Classroom';
import CreateClassroom from '../../../components/Admin/Classroom/CreateClassroom';
// import { DetailClassroomTable } from '../../../components/Admin/Classroom/DetailClassroom';
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
const DetailClassroomTable = React.lazy(() => import('../../../components/Admin/Classroom/DetailClassroom'));
export function ClassroomPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(0);
  const [show, setShowCreate] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [page, setPage] = React.useState(1);
  // const [isDetailClassroom, setIsDetailClassroom] = React.useState(false);
  const isDetailClassroom = useSelector(isDetailClassroomSelector);
  const isQRClassroom = useSelector(isQRClassroomSelector);
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
  React.useEffect(() => {
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
                      onClick={() => setShowCreate(true)}
                    >
                      Create classroom
                    </Button>
                  </div>
                </div>
              </div>
              <ClassRoom data={data} />
              {totalRecord > 20 && (
                <PaginationUI
                  handlePageChange={handlePageChange}
                  perPage={20}
                  totalRecord={totalRecord}
                  currentPage={page}
                />
              )}
            </div>
          )}
        </div>
        {/* <Modal setStateModal={() => setShowCreate(false)} show={show} elementModalBody={bodyModalCreateClass()} /> */}

        {isDetailClassroom.checkDetail && !isQRClassroom && (
          <React.Suspense>
            <DetailClassroomTable
            // isDetailClassroom.checkDetail={}
            />
          </React.Suspense>
        )}

        {!isDetailClassroom.checkDetail && isQRClassroom && <QRCodeGenerator />}

        <CreateClassroom
          show={show}
          setStateModal={() => setShowCreate(false)}
          handleGetAllClassroom={handleGetAllClassroom}
        />
      </section>
    </>
  );
}
