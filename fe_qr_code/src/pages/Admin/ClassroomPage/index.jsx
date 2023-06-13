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
import { ErrorToast } from '../../../components/Layouts/Alerts';
import Notiflix from 'notiflix';
import Skeleton from '../../../components/Layouts/Skeleton';
import NotFoundData from '../../../components/Layouts/NotFoundData';
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
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const handleGetAllClassroom = async () => {
    setLoading(true);
    const result = await getAllClassroom({
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
    setLoading(false);
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
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (search !== '') {
      const result = await getAllClassroom({
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
      const result = await getAllClassroom({
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
          {!isDetailClassroom.checkDetail && !isQRClassroom && (
            <>
              <h5 className="font-weight-bold mb-3">Danh sách lớp học</h5>
              <div className="row">
                <div className="row mb-4 justify-content-end ">
                  <div className="row">
                    <div className="col-md-8 col-sm-12 mb-2 order-sm-1 order-2">
                      <Button
                        id="create-new-product"
                        variant="outline-success"
                        className="font-weight-bold m-r-15"
                        onClick={() => setShowCreate(true)}
                        size="sm"
                      >
                        Tạo lớp học
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

                          <Button id="search-user" variant="info" type="submit" size="sm">
                            <FaSearch />
                          </Button>
                        </InputGroup>
                      </Form>
                    </div>
                  </div>
                </div>
                {loading ? (
                  <Skeleton column={4} />
                ) : data.length > 0 ? (
                  <ClassRoom data={data} handleGetAllClassroom={handleGetAllClassroom} />
                ) : (
                  <NotFoundData />
                )}

                {totalRecord > 20 && (
                  <PaginationUI
                    handlePageChange={handlePageChange}
                    perPage={20}
                    totalRecord={totalRecord}
                    currentPage={page}
                  />
                )}
              </div>
            </>
          )}
        </div>
        {/* <Modal setStateModal={() => setShowCreate(false)} show={show} elementModalBody={bodyModalCreateClass()} /> */}

        {isDetailClassroom.checkDetail && !isQRClassroom && (
          <React.Suspense>
            <h5 className="font-weight-bold mb-3">Chi tiết lớp học</h5>
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
