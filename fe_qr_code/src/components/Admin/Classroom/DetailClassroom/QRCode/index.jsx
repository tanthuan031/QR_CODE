import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { FaEdit, FaRegClock } from 'react-icons/fa';
import './style.css';
import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { setIsDetailClassroom, setIsQR } from '../../../../../redux/reducer/classroom/classroom.reducer';
const QRCodeGenerator = () => {
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const dispatch = useDispatch();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  console.log(timeLeft);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const [text, setText] = useState('');

  const handleInputChange = (event) => {
    setText(event.target.value);
  };
  const cancleQR = () => {
    dispatch(setIsQR(false));
    dispatch(setIsDetailClassroom(true));
  };
  return (
    <div>
      <div className="row mt-5">
        <div className="col col-md-3"></div>
        <div className="col col-md-6">
          <div className="d-flex justify-content-center">
            <input type="text" value={text} onChange={handleInputChange} hidden />
            <QRCode value={text} size={450} className="text-center" />
          </div>
          <div className="d-flex justify-content-center pt-3">
            <Button className="btn-secondary" onClick={() => cancleQR()}>
              Hủy
            </Button>
          </div>
        </div>
        <div className="col col-md-3">
          <div className="time_qr">
            <p>
              <FaRegClock />
            </p>
            <p>Thời gian còn lại</p>
            <p>
              {minutes}:{seconds}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
