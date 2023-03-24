import React, { useCallback, useEffect, useState } from 'react';

import SummaryStatisTic from '../../../components/admin/Statistic/Summary';
import { Col, Row } from 'react-bootstrap';

import BarChartCustomer from '../../../components/admin/Statistic/Selling/Customer';
import { setExpiredToken } from '../../../redux/reducer/auth/auth.reducer';
import { deleteCookie, getCookies } from '../../../api/Admin/Auth';
import { useDispatch } from 'react-redux';
import SkeletonDashboard from '../../../components/commons/Layouts/Skeleton/SkeletonDashboard';

export function DashBoardPage(props) {
  const month = new Date().getMonth();
  console.log(month);
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState({});
  const [chartOrder, setChartOrder] = useState([]);
  const [chartRevenue, setChartRevenue] = useState([]);
  const [chartCategory, setChartCategory] = useState([]);
  const [chartStaff, setChartStaff] = useState([]);
  const [chartCustomer, setChartCustomer] = useState([]);

  const dispatch = useDispatch();
  const [filter, setFilter] = useState('Weekly');

  return (
    <>
      <div className="container-fluid mt-5">
        <SummaryStatisTic />
      </div>
    </>
  );
}
