import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { Overview } from '../../../components/Admin/Overview';

export function OverviewPage(props) {
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
        <Overview />
      </div>
    </>
  );
}
