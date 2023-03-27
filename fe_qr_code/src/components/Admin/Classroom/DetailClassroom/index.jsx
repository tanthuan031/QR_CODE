import React, { useMemo } from 'react';
import TableLayout from '../../../Layouts/Table';
import { Table as TableBootstrap } from 'react-bootstrap';
import { useSortBy, useTable } from 'react-table';
import MOCK_DATA from './MOCK_DATA.json';
import COLUMNS from './columns';
import './style.css';
import { Button, Form, InputGroup } from 'react-bootstrap';
import Modal from '../../../Layouts/Modal';
import { FaEdit, FaSearch } from 'react-icons/fa';
import './style.css';
import { QRCodeSVG } from 'qrcode.react';
import QRCodeGenerator from './QRCode';
import { useDispatch } from 'react-redux';
import { setIsDetailClassroom, setIsQR } from '../../../../redux/reducer/classroom/classroom.reducer';
const EditableCell = ({ value: initialValue, row: { index }, column: { id }, updateMyData }) => {
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = () => {
    updateMyData(index, id, value);
  };

  return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

export function DetailClassroomTable(props) {
  const [data, setData] = React.useState(MOCK_DATA);
  const [originalData, setOriginalData] = React.useState(data);
  const [tableData, setTableData] = React.useState(data);
  const [backdrop, setBackdrop] = React.useState('static');
  const [editTable, setEditTable] = React.useState(true);
  const [createQRCode, setCreateQRCode] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const dispatch = useDispatch();

  const updateMyData = (rowIndex, columnId, value) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const columns = React.useMemo(
    () =>
      COLUMNS.map((column) => ({
        ...column,
        editable: true,
      })),
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data: tableData,
      initialState: { pageIndex: 0 },
      editTable: editTable,
    },
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  const handleSave = () => {
    // Cập nhật dữ liệu ban đầu với dữ liệu mới
    console.log(data);
    console.log(tableData);
    // const jsonData = rows.map((row) => row.values);
    setOriginalData(data);
  };

  const handleExport = () => {
    const editedRows = originalData.filter((row, i) => !Object.is(row, tableData[i]));

    console.log('Các dòng đã chỉnh sửa:', editedRows);
  };
  const setStateModal = (value) => {
    setShow(false);
  };
  const renderBody = () => {
    return (
      <Form>
        <div className="row p-5">
          <div className="col md-6">
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Phạm vi điểm danh</p>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option value="1">10 </option>
                  <option value="2">15</option>
                  <option value="3">20</option>
                </Form.Select>
                <small className="text-danger font-weight-bold"></small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Thời gian điểm danh</p>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option value="1">10 </option>
                  <option value="2">15</option>
                  <option value="3">20</option>
                </Form.Select>
                <small className="text-danger font-weight-bold"></small>
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row pb-2">
          <Form.Group className="d-flex justify-content-center">
            <Button type="button" variant="info" className="me-3 font-weight-bold" onClick={() => createQTCode()}>
              Tạo QR
            </Button>
            <Button type="button" variant="secondary" className="font-weight-bold" onClick={() => setStateModal()}>
              Quay lại
            </Button>
          </Form.Group>
        </div>
      </Form>
    );
  };
  const createQTCode = () => {
    // setCreateQRCode(true);
    dispatch(setIsQR(true));
    dispatch(setIsDetailClassroom(false));
  };
  const backToPage = () => {
    // props.isDetailClassroom = true;
    dispatch(setIsDetailClassroom(false));
    dispatch(setIsQR(false));
  };
  return (
    <>
      <div className="row mb-5 justify-content-end ">
        <div className="d-flex justify-content-between">
          <div className="d-flex  "></div>
          <div className="d-flex justify-content-between ">
            {/* <Form>
              <InputGroup>
                <Form.Control
                  id="search-order"
                  placeholder="Code classroom"
                  // onChange={(e) => setSearch(e.target.value)}
                />

                <Button id="search-user" variant="info" type="submit">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form> */}
            <Button
              id="create-new-product"
              variant="info"
              className="font-weight-bold ms-3 m-r-15"
              onClick={() => setShow(true)}
            >
              Điểm danh QR
            </Button>
            {/* <Button
              id="create-new-product"
              variant="info"
              className="font-weight-bold ms-3 m-r-15"
              onClick={() => setEditTable(false)}
            >
              Cập nhật danh sách
            </Button> */}
            <Button
              id="create-new-product"
              variant="info"
              className="font-weight-bold ms-3 m-r-15"
              onClick={() => backToPage()}
            >
              Quay lại
            </Button>
          </div>
        </div>
      </div>
      {/* Table auto edit */}
      {/* <button onClick={handleExport}>Export Data</button>
      <button onClick={handleSave}>Lưu</button>
      <div className="row listdetail_classroom">
        <table {...getTableProps()} className="listdetail_classroom_item" style={{ width: '100%' }}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="">
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.column.editable ? (
                          <EditableCell value={cell.value} updateMyData={updateMyData} row={row} column={cell.column} />
                        ) : (
                          cell.render('Cell')
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div> */}
      {/* <TableLayout tableHeader={props.tableHeader} tableBody={props.tableBody} /> */}

      <div className="row header_detail_classroom">
        <div className="col col-md-3 p-2">
          <div className="d-flex justify-content-between ">
            <p className="text-center">STT</p>

            <p className="">MSSV</p>

            <p className="">Tên sinh viên</p>
          </div>
        </div>
        <div className="col col-md-7 p-2 ">
          <div className="d-flex align-items-center justify-content-center">
            <p className=" text-center">Tuần</p>
          </div>
        </div>
        <div className="col col-md-2 p-2">
          <div className="d-flex align-items-center justify-content-center">
            <p className="text-center" style={{ width: '60%' }}>
              Điểm
            </p>
            <p className="">Action</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col col-md-3">
          <div className="d-flex justify-content-between">
            <p className="">-</p>
            <p className="">-</p>
            <p className="">-</p>
          </div>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center justify-content-center">
              <p className="">1</p>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <p className="">3119410420</p>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <p className="">Nguyen Van A</p>
            </div>
          </div>
          <div className="d-flex justify-content-between">
            <div className="d-flex align-items-center justify-content-center">
              <p className="">1</p>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <p className="">3119410420</p>
            </div>
            <div className="d-flex align-items-center justify-content-center">
              <p className="">Nguyen Van A</p>
            </div>
          </div>
        </div>
        <div className="col col-md-7">
          <div className="d-flex align-items-center" style={{ position: 'relative' }}>
            <div className="justify-content-center">
              <div className="d-flex my-custom-scrollbar">
                <div>
                  {/* Buoi */}
                  <div className="d-flex text-center">
                    <p style={{ width: '90px', border: '1px solid' }}>1</p>
                    <p style={{ width: '90px', border: '1px solid' }}>2</p>
                    <p style={{ width: '90px', border: '1px solid' }}>3</p>
                    <p style={{ width: '90px', border: '1px solid' }}>4</p>
                    <p style={{ width: '90px', border: '1px solid' }}>5</p>
                    <p style={{ width: '90px', border: '1px solid' }}>6</p>
                    <p style={{ width: '90px', border: '1px solid' }}>7</p>
                    <p style={{ width: '90px', border: '1px solid' }}>8</p>
                    <p style={{ width: '90px', border: '1px solid' }}>9</p>
                    <p style={{ width: '90px', border: '1px solid' }}>10</p>
                    <p style={{ width: '90px', border: '1px solid' }}>11</p>
                    <p style={{ width: '90px', border: '1px solid' }}>12</p>
                    <p style={{ width: '90px', border: '1px solid' }}>13</p>
                    <p style={{ width: '90px', border: '1px solid' }}>14</p>
                    <p style={{ width: '90px', border: '1px solid' }}>15</p>
                  </div>
                  {/* Diem danh */}
                  <div className="d-flex">
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                  </div>

                  <div className="d-flex">
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                    <div className="d-flex text-center">
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                      <p style={{ width: '30px', border: '1px solid' }}>X</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-md-2">
          <div>
            <div className="d-flex align-items-center justify-content-center text-center">
              <p className="" style={{ width: '60%' }}>
                -
              </p>
              <p className="">-</p>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center text-center justify-content-center">
              <p className="" style={{ width: '60%' }}>
                10.0
              </p>
              <p className="">
                <FaEdit />
              </p>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center text-center justify-content-center">
              <p className="" style={{ width: '60%' }}>
                10.0
              </p>
              <p className="">
                <FaEdit />
              </p>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={show}
        backdrop={backdrop}
        setStateModal={() => setStateModal()}
        elementModalTitle={<p>Tạo QR điểm danh</p>}
        elementModalBody={renderBody()}
      />
    </>
  );
}
