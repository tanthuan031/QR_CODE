// @flow
import Notiflix from 'notiflix';
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setDataDetailClassroom, setIsDetailClassroom } from '../../../redux/reducer/classroom/classroom.reducer';
import CreateClassroom from './CreateClassroom';
import './style.css';
import { getClassroomById } from '../../../api/Admin/Classroom/classroomAPI';
import { BlockUI, BlockUICLIENT } from '../../Layouts/Notiflix';
export function ClassRoom(props) {
  const dispatch = useDispatch();

  const handleDetailClassroom = async (id, classCode, numberRollCall, numberLessonWeek) => {
    BlockUICLIENT('#root', 'fixed');
    const result = await getClassroomById(id);

    if (result === 401) {
      return false;
    } else if (result === 500) {
      return false;
    } else {
      dispatch(
        setIsDetailClassroom({
          checkDetail: true,
          idDetail: id,
          classCode: classCode,
        })
      );
      dispatch(
        setDataDetailClassroom({
          data: result,
          numberRollCall,
          numberLessonWeek,
        })
      );
    }
    Notiflix.Block.remove('#root');
  };

  return (
    <>
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
      </div>
    </>
  );
}
