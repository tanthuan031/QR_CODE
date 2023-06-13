import React, { memo } from 'react';
import './index.css';
import { Col, Row } from 'react-bootstrap';
import {
  FaArchive,
  FaBed,
  FaBell,
  FaChalkboard,
  FaCoins,
  FaPeopleArrows,
  FaShoppingCart,
  FaUserGraduate,
} from 'react-icons/fa';

function SummaryStatisTic(props) {
  return (
    <div className="row summary-container">
      <div className="col-xl-3 col-sm-6 col-12 small-box mb-2 ">
        <div>
          <div className="inner">
            <h3 className="title-main">{props.data !== null ? props.data.data.totalClassroom : 0}</h3>

            <p className="title">Tổng lớp học</p>
          </div>
          <div className="icon">
            <FaChalkboard className="icon-cart" />
          </div>
        </div>
      </div>
      <div className="col-xl-3 col-sm-6 col-12 small-box mb-2">
        <div className="inner">
          <h3 className="title-main">{props.data !== null ? props.data.data.totalPermission : 0}</h3>

          <p className="title">Tổng đơn xin nghỉ phép</p>
        </div>
        <div className="icon">
          <FaBed className="icon-revenue  m-l-2" />
        </div>
      </div>
      <div className="col-xl-3 col-sm-6 col-12 small-box mb-2">
        <div className="inner">
          <h3 className="title-main">{props.data !== null ? props.data.data.totalNotification : 0}</h3>

          <p className="title">Tổng số thông báo</p>
        </div>
        <div className="icon">
          <FaBell className="icon-customer m-l-2" />
        </div>
      </div>
      <div className="col-xl-3 col-sm-6 col-12 small-box mb-2">
        <div className="inner">
          <h3 className="title-main">{props.data !== null ? props.data.data.totalStudent : 0}</h3>
          <p className="title">Tổng số sinh viên</p>
        </div>
        <div className="icon">
          <FaUserGraduate className="icon-product m-l-2" />
        </div>
      </div>
    </div>
  );
}

export default memo(SummaryStatisTic);
