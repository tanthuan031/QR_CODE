import React, { useState } from 'react';
import { useZxing } from 'react-zxing';
import './style.css';
import { Button } from 'react-bootstrap';
import { setIsDetailClassroomClient, setIsScanQR } from '../../../../../redux/reducer/classroom/classroom.reducer';
import { useDispatch } from 'react-redux';
const ScanQRCode = ({ onDetected }) => {
  const dispatch = useDispatch();
  const [result, setResult] = useState('');
  const { ref } = useZxing({
    onResult(result) {
      setResult(result.getText());
    },
  });
  const cancelScanQR = () => {
    dispatch(setIsScanQR(false));
    dispatch(setIsDetailClassroomClient(false));
  };
  const handleAttendance = () => {
    if (result) {
      const data = JSON.parse(result);
      console.log('result', data);
    }
  };
  return (
    <>
      <div className="row mt-5 justify-content-center">
        <div className="contain_qr">
          <video ref={ref} width={340} height={300} />
        </div>

        <p>
          <span>Last result:</span>
          <span>{result}</span>
        </p>
        <div className="d-flex justify-content-center pt-3">
          <Button className="btn-info margin-right-24px" onClick={() => handleAttendance()}>
            Điểm danh
          </Button>
          <Button className="btn-secondary" onClick={() => cancelScanQR()}>
            Hủy
          </Button>
        </div>
      </div>
    </>
  );
};
export default ScanQRCode;
