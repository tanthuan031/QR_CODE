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
import { useDispatch, useSelector } from 'react-redux';
import { setIsDetailClassroom, setIsQR } from '../../../../redux/reducer/classroom/classroom.reducer';
import {
  dataDetailClassroomSelector,
  isDetailClassroomSelector,
} from '../../../../redux/selectors/classroom/classroom.selector';
import { render } from 'react-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { addSchema, addSchemaStudent } from '../../../../adapter/classroom';
import { useForm } from 'react-hook-form';
import { addDetailClassroom } from '../../../../api/Admin/Classroom/classroomAPI';
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
  const [showAddStudent, setShowAddStudent] = React.useState(false);
  const isDetailClassroom = useSelector(isDetailClassroomSelector);

  const dispatch = useDispatch();
  const dataDetail = useSelector(dataDetailClassroomSelector);

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(addSchemaStudent),
    defaultValues: {
      student_code: '',
      last_name: '',
      first_name: '',
    },
  });

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
                  <option value="1">10 Km </option>
                  <option value="2">15 Km</option>
                  <option value="3">20 Km</option>
                </Form.Select>
                <small className="text-danger font-weight-bold"></small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Thời gian điểm danh</p>
                <Form.Select aria-label="Default select example">
                  <option>Open this select menu</option>
                  <option value="1">5 phút </option>
                  <option value="2">10 phút</option>
                  <option value="3">15 phút</option>
                  <option value="4">20 phút</option>
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

  const setStateModalAddStudent = (value) => {
    setShowAddStudent(false);
  };

  const handleAddStudent = async (data) => {
    const dataStudent = {
      classroom_id: isDetailClassroom.idDetail,
      detail_classroom: [data],
    };
    const result = await addDetailClassroom(dataStudent);
    if (result === 200) {
      console.log('Tao thanh cong');
    } else if (result === 404) {
      alert('That bai');
    } else if (result === 401) {
      alert('That bai');
    } else {
      alert('that bai');
    }
  };
  const renderBodyAddStudent = () => {
    return (
      <Form onSubmit={handleSubmit(handleAddStudent)} encType="multipart/form-data">
        <div className="row p-5">
          <div className="col md-6">
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">MSSV</p>
                <Form.Control type="text" maxLength={128} {...register('student_code')} />
                <small className="text-danger font-weight-bold">{errors?.student_code?.message}</small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Họ và tên lót</p>
                <Form.Control type="text" min={1} max={20} {...register('last_name')} />
                <small className="text-danger font-weight-bold">{errors?.last_name?.message}</small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">Tên sinh viên</p>
                <Form.Control type="text" min={1} max={5} {...register('first_name')} />
                <small className="text-danger font-weight-bold">{errors?.first_name?.message}</small>
              </div>
            </Form.Group>
          </div>
        </div>
        <div className="row pb-3">
          <Form.Group className="d-flex justify-content-center">
            <Button type="submit" variant="info" className="me-3 font-weight-bold">
              Lưu lại
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="font-weight-bold"
              onClick={() => setStateModalAddStudent()}
            >
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
          <div className="d-flex  ">
            Mã lớp:<span className="font-weight-bold  padding-left-12px"> {isDetailClassroom.classCode}</span>
          </div>
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
              onClick={() => setShowAddStudent(true)}
            >
              Thêm sinh viên
            </Button>
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
        <div className="col col-md-4 p-2">
          <div className="row">
            <p className=" col col-md-2 text-center">STT</p>
            <p className="col col-md-4 text-center">MSSV</p>
            <p className="col col-md-6 text-center">Tên sinh viên</p>
          </div>
        </div>
        <div className="col col-md-7 p-2 ">
          <div className="d-flex align-items-center justify-content-center">
            <p className=" text-center">Tuần</p>
          </div>
        </div>
        <div className="col col-md-1 p-2">
          <div className="row">
            <p className="col col-md-6 text-center">Điểm</p>
            <p className="col col-md-6 text-center">Action</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col col-md-4" style={{ marginTop: '2px' }}>
          <div className="row">
            <p className=" col col-md-2 text-center">-</p>
            <p className="col col-md-4 text-center">-</p>
            <p className="col col-md-6 text-center">-</p>
          </div>
          {dataDetail.data !== undefined &&
            dataDetail.data !== null &&
            dataDetail.data.map((item, index) => {
              return (
                <div className="row" key={index}>
                  <p className="col col-md-2 " style={{ border: '1px solid' }}>
                    {index + 1}
                  </p>

                  <p
                    className="col col-md-4 text-hidden"
                    style={{ border: '1px solid' }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={item.student_code}
                  >
                    {item.student_code}
                  </p>

                  <p
                    className="col col-md-6 text-hidden "
                    style={{ border: '1px solid', padding: '0px 1px 0px 2px' }}
                    data-toggle="tooltip"
                    data-placement="top"
                    title={item.last_name + ' ' + item.first_name}
                  >
                    {item.last_name + ' ' + item.first_name}
                  </p>
                </div>
              );
            })}
        </div>
        <div className="col col-md-7" style={{ paddingLeft: 0 }}>
          <div className="d-flex align-items-center" style={{ position: 'relative' }}>
            <div className="justify-content-center">
              <div className="d-flex my-custom-scrollbar">
                <div>
                  {/* Buoi */}
                  {(() => {
                    const divs = Array.from({ length: dataDetail.numberRollCall }, (_, index) => (
                      <p key={index} style={{ width: '90px', border: '1px solid' }}>
                        {index + 1}
                      </p>
                    ));
                    return <div className="d-flex text-center">{divs} </div>;
                  })()}
                  {/* Diem danh */}

                  {dataDetail.data !== undefined &&
                    dataDetail.data !== null &&
                    dataDetail.data.map((item, index) => {
                      return (() => {
                        const divs = Array.from({ length: dataDetail.numberRollCall }, (_, index) => (
                          <div className="d-flex" key={index}>
                            {(() => {
                              const divs = Array.from({ length: dataDetail.numberLessonWeek }, (_, index) => (
                                <p style={{ width: 90 / dataDetail.numberLessonWeek, border: '1px solid' }}>
                                  <input type="radio" name="" id="" />
                                </p>
                              ));
                              return <div className="d-flex text-center">{divs} </div>;
                            })()}
                          </div>
                        ));
                        return (
                          <div className="d-flex text-center" key={index}>
                            {divs}{' '}
                          </div>
                        );
                      })();
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col col-md-1">
          <div className="row">
            <p className=" col col-md-6 text-center">-</p>
            <p className="col col-md-6 text-center">-</p>
          </div>

          {dataDetail.data !== undefined &&
            dataDetail.data !== null &&
            dataDetail.data.map((item, index) => {
              return (
                <div className="row" key={index}>
                  <p className="col col-md-6 text-center" style={{ border: '1px solid #f3f3f5' }}>
                    {item.score}
                  </p>
                  <p className="col col-md-6 text-center" style={{ border: '1px solid #f3f3f5' }}>
                    <FaEdit />
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      <Modal
        show={show}
        backdrop={backdrop}
        setStateModal={() => setStateModal()}
        elementModalTitle={<p>Tạo QR điểm danh</p>}
        elementModalBody={renderBody()}
      />

      <Modal
        show={showAddStudent}
        backdrop={backdrop}
        setStateModal={() => setStateModalAddStudent()}
        elementModalTitle={<p>Thêm sinh viên</p>}
        elementModalBody={renderBodyAddStudent()}
      />
    </>
  );
}
