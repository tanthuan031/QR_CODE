import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { FaArchive, FaCoins, FaPeopleArrows, FaShoppingCart } from 'react-icons/fa';
import './style.css';
import SummaryStatisTic from './Summary/index';
import Static from './Static';
import { Space, Table, Tag } from 'antd';
import { useDispatch } from 'react-redux';
import getRandomColor from '../../../utils/radinColor';
export function Overview(props) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [dataStatic, setDataStatic] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ['A', 'B', 'C', 'D'],
      datasets: [
        {
          data: [540, 325, 702, 300],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400'),
          ],
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);

    let datasets = [];
    props.dataAttendanceRatio !== null &&
      props.dataAttendanceRatio.data.map((item, index) => {
        const dataArr = item.data.map((item1) => {
          const { pop, push, shift, splice, unshift, _chartjs, ...dataItem } = item1;
          return dataItem.ratio;
        });
        dataArr.unshift(0);
        datasets.push({
          label: item.classroom_name,
          fill: false,
          borderColor: getRandomColor,
          tension: 0.4,
          data: dataArr,
        });
      });
    setDataStatic(datasets);
  }, [dispatch, props.dataAttendanceRatio]);

  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
    },
    {
      title: 'Tên lớp',
      dataIndex: 'class_name',
      key: 'class_name',
    },
    {
      title: 'Mã lớp',
      dataIndex: 'class_code',
      key: 'class_code',
    },
    {
      title: 'Tỉ lệ chuyên cần',
      key: 'ratio',
      dataIndex: 'ratio',
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  return (
    <>
      <div className="row mt-5">
        {/* <Chart type="pie" data={chartData} options={chartOptions} className="" width="400px" height="400px" /> */}
        <SummaryStatisTic data={props.dataTotalDashboard} />
      </div>

      <div className="row ">
        <div className="col-xl-12 ">
          <div className="card">
            <Static data={dataStatic} />
          </div>
        </div>
      </div>
    </>
  );
}
