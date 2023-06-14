// @flow
import * as React from 'react';
import { useDispatch } from 'react-redux';
import {
  setDataDetailClassroomClient,
  setIsAttendanceClient,
  setIsDetailClassroomClient,
} from '../../../redux/reducer/classroom/classroom.reducer';

import Notiflix from 'notiflix';
import { detailClassroomStudentClient } from '../../../api/Client/Classroom/classroomClientAPI';
import { getAllNotificationsClient } from '../../../api/Client/NotificationClient/notificationClientAPI';
import ImgBg from '../../../asset/img/circle.svg';
import { setDataNotificationClient } from '../../../redux/reducer/notification/notification.reducer';
import { BlockUICLIENT } from '../../Layouts/Notiflix';
import './style.css';
export function ClientOverview(props) {
  const dispatch = useDispatch();

  const handleDetailClassroom = async (idClassroom, classCode, numberRollCall, numberLessonWeek) => {
    BlockUICLIENT('#root', 'fixed');
    const result = await detailClassroomStudentClient(idClassroom);
    if (result === 401) {
      return false;
    } else if (result === 500) {
      return false;
    } else {
      const result1 = await getAllNotificationsClient({
        classCode: classCode,
        sort: [
          {
            key: 'created_at',
            value: 'desc',
          },
        ],
      });
      if (result1 === 401) {
        return false;
      } else if (result1 === 400 || result1 === 404 || result1 === 500) {
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
        dispatch(setIsAttendanceClient(false));
        dispatch(setDataNotificationClient(result1.data));
      }
    }
    Notiflix.Block.remove('#root');
  };
  const colors = ['bg-gradient-success', 'bg-gradient-2', 'bg-gradient-info'];
  let colorIndex = 0;
  return (
    <>
      <div className="row  mb-6" style={{ margin: '0 auto' }}>
        {props.data.map((item, index) => {
          const currentColor = colors[colorIndex];
          colorIndex = (colorIndex + 1) % colors.length;
          return (
            <div
              className="col-xl-3 col-sm-6 col-12 mb-4 cursor-pointer"
              onClick={() =>
                handleDetailClassroom(item.id, item.class_code, item.number_roll_call, item.number_lesson_week)
              }
              key={index}
            >
              <div className={`card ${currentColor} shadow border-0`}>
                <div className="card-body">
                  <img src={ImgBg} className="card-img-absolute" alt="circle-image"></img>
                  <div className="row ">
                    <div className="col">
                      <span className="h4  text-bold  d-block mb-2 text-center">{item.class_name}</span>
                      <span className="h6 font-bold mb-0">
                        GV: {item.teachers.last_name + ' ' + item.teachers.first_name}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 mb-0 text-sm">
                    <p>
                      Mã lớp: <span className="font-weight-bold ">{item.class_code}</span>
                    </p>
                    <span className="text-nowrap text-xs text-muted">Số tuần học : {item.number_roll_call}</span>
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
    </>
  );
}
