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
import ImgBg from '../../../asset/img/circle.svg';
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
  const colors = ['bg-gradient-success', 'bg-gradient-2', 'bg-gradient-info'];
  let colorIndex = 0;
  return (
    <>
      <div className="row " style={{ margin: '0 auto' }}>
        {props.data.map((item, index) => {
          const currentColor = colors[colorIndex];
          colorIndex = (colorIndex + 1) % colors.length;
          return (
            <div
              className="col-xl-3 col-sm-6 col-12 mb-4 cursor-pointer"
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
              <div className={`card ${currentColor} shadow border-0`}>
                <div className="card-body">
                  <img src={ImgBg} className="card-img-absolute" alt="circle-image"></img>
                  <div className="row ">
                    <div className="col">
                      <span className="h4  text-bold  d-block mb-2 text-center">{item.class_name}</span>
                      <span className="h6 font-bold mb-0">
                        GV:{item.teachers.last_name + ' ' + item.teachers.first_name}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 mb-0 text-sm">
                    <p>
                      Mã lớp: <span className="font-weight-bold ">{item.class_code}</span>
                    </p>
                    <span className="text-nowrap text-xs text-muted">Số tuần học : {item.number_roll_call}</span>
                  </div>

                  <div className="d-flex justify-content-end text-danger ">
                    <button
                      id="edit-product"
                      onClick={(e) => handleExport(e, item.id)}
                      className="cursor-pointer  mt-2 padding-right-1x text-success  d-flex align-items-center justify-content-center border-none"
                      style={{ background: 'none !important' }}
                    >
                      <FaEye />
                    </button>
                    <button
                      id="edit-product"
                      onClick={(e) => handleDeleteClassroom(e, item.id)}
                      className="cursor-pointer  mt-2 text-danger  d-flex align-items-center justify-content-center border-none "
                      style={{ background: 'none !important' }}
                    >
                      <FaTrash />
                    </button>
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
