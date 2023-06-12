import { Badge, Button, Collapse } from 'antd';
import React, { useState } from 'react';
import './style.css';
import { Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { dataNotificationClientSelector } from '../../../../redux/selectors/notification/notification.selector';
import { formatDate } from '../../../../utils/formatDate';
import { FaRegStar, FaUndoAlt } from 'react-icons/fa';
import { getAllNotificationsClient } from '../../../../api/Client/NotificationClient/notificationClientAPI';
import { isDetailClassroomClientSelector } from '../../../../redux/selectors/classroom/classroom.selector';
import { setDataNotificationClient } from '../../../../redux/reducer/notification/notification.reducer';
import Notiflix from 'notiflix';
import { BlockUICLIENT } from '../../../Layouts/Notiflix';
import Skeleton from '../../../Layouts/Skeleton';
import ImageNew from '../../../../asset/img/New.gif';
const { Panel } = Collapse;
export function NotificationClient(props) {
  const dataNotifications = useSelector(dataNotificationClientSelector);
  const isDetailClassroom = useSelector(isDetailClassroomClientSelector);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
  const handleReload = async () => {
    // BlockUICLIENT('#boddy-notification', 'fixed');
    setLoading(true);
    const result1 = await getAllNotificationsClient({
      classCode: isDetailClassroom && isDetailClassroom.classCode,
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
      dispatch(setDataNotificationClient(result1.data));
    }
    setLoading(false);
    Notiflix.Block.remove('#boddy-notification');
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
                      <div className="d-flex justify-content-between mb-2">
                        <span>
                          {index === 0 || index === 1 ? (
                            <Badge
                              count={
                                <span className=" text-danger">
                                  <img src={ImageNew} />
                                </span>
                              }
                            >
                              {/* <FaRegStar className=" star-new" /> */}
                            </Badge>
                          ) : (
                            ''
                          )}
                        </span>
                        <span className="text-bold text-dark">
                          {formatDate(item.created_at, 'DD-MM-YYYY HH:mm:ss')}
                        </span>
                      </div>

                      <div className="col-md-12 col-sm-12">
                        <p className="font-weight-bold ">{item.title}</p>
                        <p> - {item.content}</p>
                      </div>
                    </div>
                  </Alert>
                ))}
            </Panel>
          </Collapse>
        )}
      </div>
    </>
  );
}
