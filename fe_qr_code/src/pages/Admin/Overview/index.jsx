import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { Overview } from '../../../components/Admin/Overview';
import { getAllTotalDashboardAdmin, getAttendanceRatio } from '../../../api/Admin/DashboardAdmin/dashboardAdminAPI';
import { ErrorToast } from '../../../components/Layouts/Alerts';

export function OverviewPage(props) {
  const month = new Date().getMonth();

  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({});
  const [chartOrder, setChartOrder] = useState([]);
  const [chartRevenue, setChartRevenue] = useState([]);
  const [chartCategory, setChartCategory] = useState([]);
  const [chartStaff, setChartStaff] = useState([]);
  const [chartCustomer, setChartCustomer] = useState([]);

  const dispatch = useDispatch();
  const [filter, setFilter] = useState('Weekly');
  const [dataTotalDashboard, setDataTotalDashboard] = useState(null);
  const [dataAttendanceRatio, setDataAttendanceRatio] = useState(null);
  const handleGetTotalDashboard = async () => {
    const result = await getAllTotalDashboardAdmin({
      total: 'a',
    });

    if (result === 401) {
      return false;
    } else if (result === 500) {
      ErrorToast('Có lỗi xảy ra. Vui lòng thử lại', 3000);
    } else {
      setDataTotalDashboard(result);
    }
  };

  const handleGetAttendanceRatio = async () => {
    const result1 = await getAttendanceRatio();

    if (result1 === 401) {
      return false;
    } else if (result1 === 500) {
      ErrorToast('Có lỗi xảy ra. Vui lòng thử lại', 3000);
    } else {
      setDataAttendanceRatio(result1);
    }
  };

  useEffect(() => {
    handleGetTotalDashboard();
    handleGetAttendanceRatio();
  }, []);
  return (
    <>
      <div className="container-fluid mt-5">
        <Overview dataTotalDashboard={dataTotalDashboard} dataAttendanceRatio={dataAttendanceRatio} />
      </div>
    </>
  );
}
