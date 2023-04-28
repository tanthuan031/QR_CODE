// @flow
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import {
  setDataDetailClassroomClient,
  setIsDetailClassroom,
  setIsDetailClassroomClient,
} from '../../../redux/reducer/classroom/classroom.reducer';

import './style.css';
import JoinClassroom from './JoinClassroom';
import { detailClassroomStudentClient } from '../../../api/Client/Classroom/classroomClientAPI';
export function ClientOverview(props) {
  const dispatch = useDispatch();
  const [show, setShowJoin] = React.useState(false);
  const handleDetailClassroom = async (idClassroom, classCode, numberRollCall, numberLessonWeek) => {
    const result = await detailClassroomStudentClient(idClassroom);
    if (result === 401) {
      return false;
    } else if (result === 500) {
      return false;
    } else {
      dispatch(
        setIsDetailClassroomClient({
          checkDetail: true,
          idDetail: idClassroom,
          classCode: classCode,
        })
      );
      dispatch(
        setDataDetailClassroomClient({
          data: result,
          numberRollCall,
          numberLessonWeek,
        })
      );
    }
  };
  return (
    <>
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
      <div className="row ">
        {props.data.map((item, index) => {
          return (
            <div
              className="col col-md-3  mb-4 cursor-pointer"
              onClick={() =>
                handleDetailClassroom(item.id, item.class_code, item.number_roll_call, item.number_lesson_week)
              }
              key={index}
            >
              <div className="classroom_content">
                <div className="classroom_header">
                  <div className="classroom_background_header"></div>
                  <div className="classroom_content_header">
                    <h3>{item.class_name}</h3>
                    <span>Tên giảng viên : {item.teachers.first_name + ' ' + item.teachers.last_name}</span>
                  </div>
                </div>
                <div className="classroom_footer">
                  <div className="row">
                    <div className="col col-md-12">
                      <p>Số tuần học : {item.number_roll_call}</p>
                      <p>
                        Mã lớp: <span className="font-weight-bold ">{item.class_code}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* <div className="col md-3  mb-4 cursor-pointer" onClick={() => handleDetailClassroom()}>
          <div className="classroom_content">
            <div className="classroom_header">
              <div className="classroom_background_header"></div>
              <div className="classroom_content_header">
                <h3>DCT1193</h3>
                <span>Ten giang vien</span>
              </div>
            </div>
            <div className="classroom_footer"></div>
          </div>
        </div> */}
      </div>
      <JoinClassroom show={show} setStateModal={() => setShowJoin(false)} />
    </>
  );
}
