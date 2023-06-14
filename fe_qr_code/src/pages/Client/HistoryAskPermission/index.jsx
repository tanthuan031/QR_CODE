// @flow
import Notiflix from 'notiflix';
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { getAllHistoryAskPerClient } from '../../../api/Client/HistoryAskPermission/historyPermissionClientAPI';
import { ClientHistoryPermission } from '../../../components/Client/HistoryAskPermission';
import { ErrorToast } from '../../../components/Layouts/Alerts';

export function ClientHistoryPermissionPage() {
  const dispatch = useDispatch();
  const [totalRecord, setTotalRecords] = React.useState(11);
  const [show, setShowJoin] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [data, setData] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const setHistory = (result, value) => {
    setData(result.data);
    if (value !== 'page') {
      setPage(1);
    }
    setTotalRecords(result.total);
    // setTotalPage(result.meta.last_page);
  };
  const handleGetAllHistoryPermissionClient = async () => {
    const result = await getAllHistoryAskPerClient({
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
    handleGetAllHistoryPermissionClient();
  }, [dispatch]);

  const handlePageChange = async (page) => {
    setPage(page);
    const result = await getAllHistoryAskPerClient({
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
      const result = await getAllHistoryAskPerClient({
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
      const result = await getAllHistoryAskPerClient({
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

  return (
    <>
      <section>
        <div className="container-fluid mt-5">
          <h5 className="font-weight-bold mb-3">Danh sách lịch sử nghỉ phép</h5>

          <div className="row">
            <div className="row mb-5 justify-content-end ">
              <div className="d-flex justify-content-end">
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

            <ClientHistoryPermission data={data} onSubmitUpdateAskPermission={handleGetAllHistoryPermissionClient} />
            {/* {totalRecord > 10 && (
                <PaginationUI handlePageChange={handlePageChange} perPage={10} totalRecord={200} currentPage={1} />
              )} */}
          </div>
        </div>
      </section>
    </>
  );
}
