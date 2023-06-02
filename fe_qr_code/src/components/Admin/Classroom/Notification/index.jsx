import { Badge, Button, Collapse, Modal as ModalConfirm } from 'antd';
import React, { useState } from 'react';
import './style.css';
import { Form, Alert, Button as ButtonReact } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  dataNotificationAdminSelector,
  dataNotificationClientSelector,
} from '../../../../redux/selectors/notification/notification.selector';
import { formatDate } from '../../../../utils/formatDate';
import { FaEdit, FaRegStar, FaTrash, FaUndoAlt } from 'react-icons/fa';
import { getAllNotificationsClient } from '../../../../api/Client/NotificationClient/notificationClientAPI';
import { isDetailClassroomClientSelector } from '../../../../redux/selectors/classroom/classroom.selector';
import {
  setDataNotificationAdmin,
  setDataNotificationClient,
} from '../../../../redux/reducer/notification/notification.reducer';
import Notiflix from 'notiflix';
import { BlockUICLIENT } from '../../../Layouts/Notiflix';
import Skeleton from '../../../Layouts/Skeleton';
import ImageNew from '../../../../asset/img/New.gif';
import {
  deleteNotification,
  getAllNotificationsAdmin,
  updateNotificationAdmin,
} from '../../../../api/Admin/NotificationAdmin/notificationAdminAPI';
import Modal from '../../../Layouts/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addSchemaNotification } from '../../../../adapter/classroom';
import { isDetailClassroomSelector } from '../../../../redux/selectors/classroom/classroom.selector';
import { ErrorToast, SuccessToast } from '../../../Layouts/Alerts';
const { Panel } = Collapse;
export function NotificationAdmin(props) {
  const [backdrop, setBackdrop] = React.useState('static');
  const dataNotifications = useSelector(dataNotificationAdminSelector);
  const isDetailClassroom = useSelector(isDetailClassroomSelector);
  const [showUpdateNotification, setUpdateNotification] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {
    register: registerUpdateNotification,
    handleSubmit: handleSubmitUpdateNotification,
    reset: resetNotification,
    control: controlNotification,
    formState: { isValid: isValidNotification, errors: notificationErrors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(addSchemaNotification),
  });
  const getRandomVariant = () => {
    const variants = [
      'primary',
      'success',
      'info',
      'danger',
      'warning',
      'primary',
      'info',
      'success',
      'danger',
      'warning',
    ];
    const randomIndex = Math.floor(Math.random() * variants.length);
    return variants[randomIndex];
  };

  // Notification
  const handleSubmitNotifications = async (data) => {
    BlockUICLIENT('#root', 'fixed');
    const dataNotifi = {
      class_code: data.class_code,
      title: data.title,
      content: data.content,
    };
    const result = await updateNotificationAdmin(data.id, dataNotifi);
    if (result === 200) {
      handleReload();
      SuccessToast('Cập nhật thông báo thành công', 3500);
      Notiflix.Block.remove('.sl-box');
      setUpdateNotification(false);
      resetNotification();
    } else {
      ErrorToast('Cập nhật thông báo thất bại', 3500);
      Notiflix.Block.remove('.sl-box');
    }
    Notiflix.Block.remove('#root');
  };

  const renderBodyUpdateNotification = () => {
    return (
      <Form encType="multipart/form-data" onSubmit={handleSubmitUpdateNotification(handleSubmitNotifications)}>
        <div className="row p-5">
          <div className="col md-6">
            <div className="row">
              <div className="col-md-6">
                <Form.Group className=" mb-3">
                  <div className="cp-input">
                    <p className="font-weight-bold">Mã lớp</p>
                    <Form.Control
                      type="text"
                      maxLength={128}
                      value={isDetailClassroom.classCode}
                      name="class_code"
                      disabled
                    />
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className=" mb-3">
                  <div className="cp-input">
                    <p className="font-weight-bold">Tên lớp</p>
                    <Form.Control
                      type="text"
                      maxLength={128}
                      value={isDetailClassroom.nameClassroom}
                      name="class_name"
                      disabled
                    />
                  </div>
                </Form.Group>
              </div>
            </div>

            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">
                  Tiêu đề <span className="text-danger">*</span>
                </p>
                <Form.Control
                  type="text"
                  maxLength={128}
                  name="title"
                  placeholder="Nhập tiêu đề..."
                  {...registerUpdateNotification('title')}
                />
                <small className="text-danger font-weight-bold">{notificationErrors?.title?.message}</small>
              </div>
            </Form.Group>
            <Form.Group className=" mb-3">
              <div className="cp-input">
                <p className="font-weight-bold">
                  Nội dung <span className="text-danger">*</span>
                </p>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Nhập nội dung...  "
                  name="content"
                  {...registerUpdateNotification('content')}
                />
                <small className="text-danger font-weight-bold">{notificationErrors?.content?.message}</small>
              </div>
            </Form.Group>
            <Form.Control
              type="text"
              maxLength={128}
              value={isDetailClassroom.classCode}
              name="class_code"
              {...registerUpdateNotification('class_code')}
              hidden
            />
          </div>
        </div>
        <div className="row pb-3">
          <Form.Group className="d-flex justify-content-center">
            <ButtonReact type="submit" variant="outline-info" className="me-3 font-weight-bold">
              Cập nhật
            </ButtonReact>
            <ButtonReact
              type="button"
              variant="outline-secondary"
              className="font-weight-bold"
              onClick={() => setUpdateNotification(false)}
            >
              Quay lại
            </ButtonReact>
          </Form.Group>
        </div>
      </Form>
    );
  };

  const setStateModalCreateNotification = (value) => {
    setUpdateNotification(false);
  };

  const handleReload = async () => {
    // BlockUICLIENT('#boddy-notification', 'fixed');
    setLoading(true);
    const result1 = await getAllNotificationsAdmin({
      classCode: isDetailClassroom && isDetailClassroom.classCode,
      sort: [
        {
          key: 'updated_at',
          value: 'desc',
        },
      ],
    });
    if (result1 === 401) {
      setLoading(false);
      return false;
    } else if (result1 === 400 || result1 === 404 || result1 === 500) {
      setLoading(false);
      return false;
    } else {
      dispatch(setDataNotificationAdmin(result1.data));
    }
    setLoading(false);
    Notiflix.Block.remove('#boddy-notification');
  };
  const handleUpdateNoti = (data) => {
    setUpdateNotification(true);
    resetNotification(data);
  };
  const handleDeleteNoti = (id) => {
    ModalConfirm.confirm({
      title: 'Cảnh báo',
      icon: '',
      content: `Bạn muốn xóa thông báo này`,
      // okText: 'Thử lại',
      // // cancelText: 'Đóng',
      onOk: async () => {
        // Notiflix.Block.remove('.sl-box');
        const result = await deleteNotification(id);
        if (result === 200) {
          handleReload();
          SuccessToast('Xóa thông báo thành công', 3500);
          Notiflix.Block.remove('.sl-box');
        } else {
          ErrorToast('Xóa thông báo thất bại', 3500);
          Notiflix.Block.remove('.sl-box');
        }
      },
      okButtonProps: {
        style: {
          backgroundColor: '#ff4d4f',
        },
      },
      centered: true,
    });
  };
  return (
    <>
      <div className="row mb-5 justify-content-start ">
        {loading ? (
          <Skeleton column={4} />
        ) : (
          <Collapse defaultActiveKey={'1'}>
            <Panel header={<h6>Xem chi tiết</h6>} key="1" id="boddy-notification">
              <Button variant="outline-success" className="mb-2" onClick={() => handleReload()}>
                <FaUndoAlt className="text-primary ml-2 " />
              </Button>
              {dataNotifications.length > 0 &&
                dataNotifications.map((item, index) => (
                  <Alert key={index} variant={getRandomVariant()} style={{ padding: '5px 16px' }}>
                    <div className="row">
                      <div className="col-md-11">
                        <p className="text-bold ">
                          {item.title} - {formatDate(item.created_at, 'DD-MM-YYYY HH:mm:ss')}
                        </p>
                        <p> - {item.content}</p>
                      </div>
                      <div className="col-md-1">
                        <div style={{ margin: '20%' }}>
                          <FaEdit
                            className="text-info font-23px cursor-pointer "
                            onClick={() => handleUpdateNoti(item)}
                          />
                          <FaTrash
                            className="margin-left-12px text-danger font-16px cursor-pointer"
                            onClick={() => handleDeleteNoti(item.id)}
                          />
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
            </Panel>
          </Collapse>
        )}
      </div>
      <Modal
        show={showUpdateNotification}
        backdrop={backdrop}
        setStateModal={() => setStateModalCreateNotification()}
        elementModalTitle={<p>Cập nhật thông báo</p>}
        elementModalBody={renderBodyUpdateNotification()}
      />
    </>
  );
}
