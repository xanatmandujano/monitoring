import React, { useState } from "react";
//Apex chart
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
//Bootstrap
import Container from "react-bootstrap/Container";

const LineChart = () => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: "Alarmas",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
      },
    ],
    options: {
      chart: {
        height: 400,
        type: "line",
        zoom: {
          enabled: false,
        },
        fontFamily: "Kanit, sans-serif",
        fontWeight: "100",
        foreColor: "#fff",
        background: "#0f0f0f",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Alarmas por sucursal",
        align: "left",
        style: {
          fontWeight: "bold",
        },
      },
      grid: {
        row: {
          colors: ["#ffffff2c", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      tooltip: {
        theme: "dark",
      },
      theme: {
        mode: "dark",
        monochrome: {
          enabled: true,
          color: "#d70e11",
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
        ],
      },
    },
  });

  return (
    <Container className="line-chart">
      <Chart
        className="chart"
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={400}
      />
    </Container>
  );
};

export default LineChart;
