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
import { checkLoginFirstClientSelector } from '../../../redux/selectors/auth/auth.selector';
import Modal from '../../../components/Layouts/Modal';
import { setLoginFirst } from '../../../redux/reducer/auth/auth.reducer';
import { Modal as ModalConfirm } from 'antd';

export function ClientOverviewPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(11);
  const [backdrop, setBackdrop] = React.useState('static');
  const [show, setShowJoin] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  // const [isDetailClassroom, setIsDetailClassroom] = React.useState(false);
  const isDetailClassroomClient = useSelector(isDetailClassroomClientSelector);
  const isScanQRClassroom = useSelector(isScanQRClassroomSelector);
  const isAttendance = useSelector(isAttendanceClientSelector);
  const checkLoginFirst = useSelector(checkLoginFirstClientSelector);
  const [search, setSearch] = React.useState('');
  const [dataLoginFirst, setDataLoginFirst] = React.useState(false);

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
    const checkFirstLogin = localStorage.getItem('loginFirst');
    if (checkFirstLogin) {
      setDataLoginFirst(checkFirstLogin);
    }
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

  const handleRemoveLoginFirst = () => {
    setDataLoginFirst(false);
    localStorage.removeItem('loginFirst');
  };
  const renderBodyLoginFirst = () => {
    return (
      <>
        <div style={{ padding: '20px' }}>
          <div className="text-bold">
            Quy định sử dụng phần mềm điểm danh QR code thông minh với tính năng nhận diện khuôn mặt và vị trí của chúng
            tôi:
          </div>
          <br />
          <div className="text-bold">1. Mục đích và phạm vi sử dụng:</div>
          &nbsp;&nbsp;&nbsp;&nbsp;a. Phần mềm điểm danh QR code thông minh được sử dụng nhằm quản lý và giám sát quá
          trình điểm danh của nhân viên hoặc thành viên trong tổ chức, doanh nghiệp, trường học hoặc cơ quan.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;b. Tính năng nhận diện khuôn mặt và vị trí được tích hợp nhằm đảm bảo tính chính xác
          và tránh gian lận trong quá trình điểm danh.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;c. Quy định này áp dụng cho tất cả người dùng phần mềm điểm danh QR code thông minh và
          có thể được điều chỉnh hoặc bổ sung theo từng trường hợp cụ thể.
          <br />
          <br />
          <div className="text-bold">2. Đăng ký và sử dụng tài khoản:</div>
          &nbsp;&nbsp;&nbsp;&nbsp;a. Người dùng cần đăng ký tài khoản cá nhân để sử dụng phần mềm điểm danh QR code
          thông minh.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;b. Thông tin đăng ký tài khoản bao gồm mã sinh viên, tên đầy đủ, địa chỉ email và
          thông tin cá nhân khác có thể yêu cầu.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;c. Việc sử dụng tài khoản của người khác hoặc chia sẻ tài khoản với người khác là
          không được phép.
          <br />
          <br />
          <div className="text-bold"> 3. Quá trình điểm danh:</div>
          &nbsp;&nbsp;&nbsp;&nbsp;a. Người dùng cần quét mã QR code hoặc sử dụng tính năng nhận diện khuôn mặt để điểm
          danh khi có yêu cầu.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;b. Hệ thống sẽ ghi lại thời gian điểm danh, vị trí và thông tin nhận diện khuôn mặt
          của người dùng.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;c. Người dùng không được phép sử dụng phương pháp hay công cụ gian lận hoặc thay thế
          để điểm danh thay mặt người khác.
          <br />
          <br />
          <div className="text-bold"> 4. Quy định:</div>
          &nbsp;&nbsp;&nbsp;&nbsp;a. Nếu phát hiện có dấu hiệu gian lận, bao gồm việc sử dụng tài khoản của người khác,
          thay đổi thông tin nhận diện khuôn mặt hoặc vị trí, người dùng sẽ bị khóa tài khoản.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;b. Quyết định khóa tài khoản sẽ được thực hiện bởi quản trị viên hoặc người có thẩm
          quyền trong tổ chức sử dụng phần mềm điểm danh.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;c. Khi tài khoản bị khóa, người dùng sẽ không thể tiếp tục sử dụng.
          <br />
          <br />
          <div className="text-bold">5. Yêu cầu kết nối mạng và quyền truy cập:</div>
          &nbsp;&nbsp;&nbsp;&nbsp;a. Để sử dụng phần mềm điểm danh, người dùng cần có{' '}
          <span className="text-danger">kết nối mạng</span> để truy cập vào hệ thống.
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;b. Đồng thời, phần mềm cần được{' '}
          <span className="text-danger">cấp quyền truy cập vào vị trí và camera</span> của thiết bị để sử dụng tính năng
          nhận diện khuôn mặt và ghi lại vị trí.
          <br />
          <br />
          <div className="text-bold">7. Bảo mật thông tin người dùng:</div>
          a. Tất cả thông tin cá nhân và dữ liệu của người dùng được bảo mật và không được chia sẻ ra bên ngoài phạm vi
          tổ chức sử dụng phần mềm điểm danh.
          <br />
          b. Quản trị viên và người có thẩm quyền sẽ đảm bảo sự bảo mật và tuân thủ các quy định về bảo mật dữ liệu.
          <br />
        </div>
        <div className="d-flex justify-content-end">
          <Button variant="outline-primary" style={{ margin: '10px', width: '50px' }} onClick={handleRemoveLoginFirst}>
            Ok
          </Button>
        </div>
      </>
    );
  };
  return (
    <>
      <section>
        <div className="container-fluid mt-5">
          <Modal
            show={dataLoginFirst}
            backdrop={backdrop}
            setStateModal={() => handleRemoveLoginFirst()}
            elementModalTitle={<p>Thông báo</p>}
            elementModalBody={renderBodyLoginFirst()}
          />
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
