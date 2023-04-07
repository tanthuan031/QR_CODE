// @flow
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setDataDetailClassroom, setIsDetailClassroom } from '../../../redux/reducer/classroom/classroom.reducer';
import CreateClassroom from './CreateClassroom';
import './style.css';
import { getClassroomById } from '../../../api/Admin/Classroom/classroomAPI';
export function ClassRoom(props) {
  const dispatch = useDispatch();
  const [show, setShowCreate] = React.useState(false);
  const handleDetailClassroom = async (id, numberRollCall, numberLessonWeek) => {
    const result = await getClassroomById(id);
    if (result === 401) {
      return false;
    } else if (result === 500) {
      return false;
    } else {
      dispatch(setIsDetailClassroom(true));
      dispatch(
        setDataDetailClassroom({
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
                  placeholder="Code classroom"
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
      <div className="row justify-content-center">
        {props.data.map((item, index) => {
          return (
            <div
              className="col md-3  mb-4 cursor-pointer"
              onClick={() => handleDetailClassroom(item.id, item.number_roll_call, item.number_lesson_week)}
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
                  <p>Số tuần học : {item.number_roll_call}</p>
                  <p>Sĩ số : {100}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CreateClassroom show={show} setStateModal={() => setShowCreate(false)} />
    </>
  );
}
