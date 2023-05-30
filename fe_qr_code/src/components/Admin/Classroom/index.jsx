// @flow
import Notiflix from 'notiflix';
import * as React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FaEye, FaFileExport, FaSearch, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setDataDetailClassroom, setIsDetailClassroom } from '../../../redux/reducer/classroom/classroom.reducer';
import CreateClassroom from './CreateClassroom';
import './style.css';
import { deleteClassroom, getClassroomById } from '../../../api/Admin/Classroom/classroomAPI';
import { BlockUI, BlockUICLIENT } from '../../Layouts/Notiflix';
import { Modal as ModalConfirm } from 'antd';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import { getAllNotificationsAdmin } from '../../../api/Admin/NotificationAdmin/notificationAdminAPI';
import { setDataNotificationAdmin } from '../../../redux/reducer/notification/notification.reducer';
export function ClassRoom(props) {
  const dispatch = useDispatch();

  const handleDetailClassroom = async (id, classCode, nameClassroom, nameTeacher, numberRollCall, numberLessonWeek) => {
    BlockUICLIENT('#root', 'fixed');
    const result = await getClassroomById(id);

    if (result === 401) {
      return false;
    } else if (result === 500) {
      return false;
    } else {
      const result1 = await getAllNotificationsAdmin({
        classCode: classCode,
        sort: [
          {
            key: 'updated_at',
            value: 'desc',
          },
        ],
      });
      if (result1 === 401) {
        ErrorToast('Có lỗi xảy ra . Vui lòng thử lại sau', 1500);
        Notiflix.Block.remove('#root');
        return false;
      } else if (result1 === 400 || result1 === 404 || result1 === 500) {
        ErrorToast('Có lỗi xảy ra . Vui lòng thử lại sau', 1500);
        Notiflix.Block.remove('#root');
        return false;
      } else {
        dispatch(
          setIsDetailClassroom({
            checkDetail: true,
            idDetail: id,
            classCode: classCode,
            nameClassroom: nameClassroom,
            nameTeacher: nameTeacher,
          })
        );
        dispatch(
          setDataDetailClassroom({
            data: result,
            numberRollCall,
            numberLessonWeek,
          })
        );

        dispatch(setDataNotificationAdmin(result1.data));
      }
    }
    Notiflix.Block.remove('#root');
  };
  const handleDeleteClassroom = async (e, id) => {
    e.stopPropagation();
    ModalConfirm.confirm({
      title: 'Cảnh báo',
      icon: '',
      content: `Bạn muốn xóa lớp học này`,
      okText: 'Xóa',
      // cancelText: 'Đóng',
      onOk: async () => {
        BlockUICLIENT('#root', 'fixed');
        const result = await deleteClassroom(id);
        if (result === 200) {
          SuccessToast('Xóa lớp học thành công', 3500);
          Notiflix.Block.remove('.sl-box');
          props.handleGetAllClassroom();
        } else if (result === 403) {
          ErrorToast('Xóa lớp học thất bại', 3500);
          Notiflix.Block.remove('.sl-box');
        } else {
          ErrorToast('Có lỗi . Vui lòng thử lại', 3500);
          Notiflix.Block.remove('.sl-box');
        }
        Notiflix.Block.remove('#root');
      },
      okButtonProps: {
        style: {
          backgroundColor: '#ff4d4f',
        },
      },
      centered: true,
    });
  };
  const handleExport = () => {};
  return (
    <>
      <div className="row ">
        {props.data.map((item, index) => {
          return (
            <div
              className="col col-md-3  mb-4 cursor-pointer"
              onClick={() =>
                handleDetailClassroom(
                  item.id,
                  item.class_code,
                  item.class_name,
                  item.teachers.first_name + ' ' + item.teachers.last_name,
                  item.number_roll_call,
                  item.number_lesson_week
                )
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
                    <div className="col col-md-9">
                      <p>Số tuần học : {item.number_roll_call}</p>
                      <p>
                        Mã lớp: <span className="font-weight-bold ">{item.class_code}</span>
                      </p>
                    </div>
                    <div className="d-flex col col-md-3 text-danger ">
                      <button
                        id="edit-product"
                        onClick={(e) => handleExport(e, item.id)}
                        className="cursor-pointer  mt-2 padding-right-1x  bg-gray-100 text-success  d-flex align-items-center justify-content-center border-none"
                      >
                        <FaEye />
                      </button>
                      <button
                        id="edit-product"
                        onClick={(e) => handleDeleteClassroom(e, item.id)}
                        className="cursor-pointer  mt-2  bg-gray-100 text-danger  d-flex align-items-center justify-content-center border-none "
                      >
                        <FaTrash />
                      </button>
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
