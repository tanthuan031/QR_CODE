import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { FaArchive, FaCoins, FaPeopleArrows, FaShoppingCart } from 'react-icons/fa';
import './style.css';
export function Overview() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
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
  }, []);
  return (
    <>
      <div className="row "></div>
      <div className="row mt-5">
        <div className="col col-md-12">
          <Chart type="pie" data={chartData} options={chartOptions} className="" width="400px" height="400px" />
        </div>
      </div>
    </>
  );
}
