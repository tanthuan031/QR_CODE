import React, { useMemo } from 'react';
import TableLayout from '../../../Layouts/Table';
import { useSortBy, useTable } from 'react-table';
import MOCK_DATA from './MOCK_DATA.json';
import COLUMNS from './columns';
import './style.css';
import { Button, Form, InputGroup } from 'react-bootstrap';
import Modal from '../../../Layouts/Modal';
import { FaSearch } from 'react-icons/fa';
import './style.css';
import { QRCodeSVG } from 'qrcode.react';
import QRCodeGenerator from './QRCode';
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
    return createQRCode ? (
      <>
        <QRCodeGenerator />
      </>
    ) : (
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
    setCreateQRCode(true);
  };
  const backToPage = () => {
    // props.isDetailClassroom = true;
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
            <Button
              id="create-new-product"
              variant="info"
              className="font-weight-bold ms-3 m-r-15"
              onClick={() => setEditTable(false)}
            >
              Cập nhật danh sách
            </Button>
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

      <button onClick={handleExport}>Export Data</button>
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
