import React, { memo, useEffect, useState } from 'react';
// import './index.css';
import { Chart } from 'primereact/chart';
import { Row } from 'react-bootstrap';

function Static(props) {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: [
        'Tuần',
        'Tuần 1',
        'Tuần 2',
        'Tuần 3',
        'Tuần 4',
        'Tuần 5',
        'Tuần 6',
        'Tuần 7',
        'Tuần 8',
        'Tuần 9',
        'Tuần 10',
        'Tuần 11',
        'Tuần 12',
        'Tuần 13',
        'Tuần 14',
        'Tuần 15',
      ],
      datasets: props.data,
    };
    const options = {
      stacked: false,
      maintainAspectRatio: false,
      aspectRatio: 0.7,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            drawOnChartArea: false,
            color: surfaceBorder,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [props.data]);

  return (
    <Row className="summary-container">
      <Chart type="line" data={chartData} options={chartOptions} />
    </Row>
  );
}

export default memo(Static);
