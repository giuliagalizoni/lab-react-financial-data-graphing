import { useEffect, useState } from "react";

import Chart from "chart.js/auto";
import axios from "axios";

function MyChart() {
  const [dates, setDates] = useState([]);
  const [prices, setPrices] = useState([]);
  const [chart, setChart] = useState();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://api.coindesk.com/v1/bpi/historical/close.json"
        );
        const entries = Object.entries(response.data.bpi);
        entries.sort((a, b) => {
          return new Date(a[0]) - new Date(b[0]);
        });
        setDates(entries.map((currentArr) => currentArr[0]));

        setPrices(entries.map((currentArr) => currentArr[1]));
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const ctx = document.getElementById("myChart");

    if (chart) {
      chart.destroy();
    }

    const myChart = new Chart(ctx, {
      type: "line",
      responsive: true,
      maintainAspectRatio: false,
      data: {
        labels: dates,
        datasets: [
          {
            label: "Price variation BTC",
            data: prices,
            fill: false,
            borderColor: "rgb(75,192,192)",
            tension: 0.1,
          },
        ],
      },
    });
    setChart(myChart);
  }, [dates, prices]);

  return (
    <div style={{ position: "relative", height: "30vh" }}>
      <canvas id="myChart" width="100" height="100"></canvas>
    </div>
  );
}

export default MyChart;
