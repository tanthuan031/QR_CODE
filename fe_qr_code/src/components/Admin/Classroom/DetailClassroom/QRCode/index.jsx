import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { FaEdit, FaRegClock } from 'react-icons/fa';
import './style.css';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDetailClassroom, setIsQR } from '../../../../../redux/reducer/classroom/classroom.reducer';
import {
  dataCreateQRCodeSelector,
  isDetailClassroomSelector,
} from '../../../../../redux/selectors/classroom/classroom.selector';
import Countdown from 'react-countdown-now';
import { SuccessToast } from '../../../../Layouts/Alerts';
import CryptoJS from 'crypto-js';

const QRCodeGenerator = () => {
  const dispatch = useDispatch();
  const dataCreateQRCode = useSelector(dataCreateQRCodeSelector);
  const isDetailClassroom = useSelector(isDetailClassroomSelector);

  const [text, setText] = useState(dataCreateQRCode);
  const onComplete = () => {
    setText('');
    SuccessToast('Hết thời gian điểm danh', 3000);
    cancelQR();
    console.log('Countdown completed');
  };

  const cancelQR = () => {
    dispatch(setIsQR(false));
    dispatch(
      setIsDetailClassroom({
        ...isDetailClassroom,
        checkDetail: true,
      })
    );
  };

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <>Hết giờ</>;
    } else {
      // Render a countdown
      return (
        <span>
          {minutes}:{seconds}
        </span>
      );
    }
  };
  /*********Mã hóa dữ liệu ***************/

  const dataToEncode = JSON.stringify(text);
  const secretKey = 'qr_code'; // Khóa bí mật dùng để mã hóa và giải mã
  const encryptedData = CryptoJS.AES.encrypt(dataToEncode, secretKey).toString();
  /*********      **       ***************/

  const isMobile = window.innerWidth <= 767; // Điều kiện cho kích thước mobile (767px)
  const qrCodeSize = isMobile ? 300 : 450;
  return (
    <div>
      <div className="row mt-5">
        <div className="col-xl-3 col-sm-12 col-12"></div>
        <div className="col-xl-6 col-sm-12 col-12">
          <h3 className="text-center mt-5">Mã QR CODE điểm danh</h3>
          <h6 className="text-center mb-5">Vui lòng cung cấp mã QR CODE này cho lớp học để điểm danh</h6>
          <div className="d-flex justify-content-center">
            <QRCode value={encryptedData} size={qrCodeSize} className="text-center" />
          </div>
          <div className="d-flex justify-content-center pt-3">
            <Button className="btn-secondary" onClick={() => cancelQR()}>
              Hủy
            </Button>
          </div>
        </div>
        <div className="col-xl-3 col-sm-12 col-12">
          <div className="time_qr">
            <p>
              <FaRegClock />
            </p>
            <p>Thời gian còn lại</p>
            <p>
              <Countdown
                date={Date.now() + dataCreateQRCode.attendance_time * 60000}
                renderer={renderer}
                onComplete={onComplete}
                zeroPadTime={2}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
