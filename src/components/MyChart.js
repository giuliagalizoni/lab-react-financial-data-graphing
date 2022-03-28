import { useEffect, useState } from "react";

import Chart from "chart.js/auto";
import axios from "axios";

import DateInput from "./DateInput";

function MyChart() {
  const [dates, setDates] = useState([]);
  const [prices, setPrices] = useState([]);
  const [chart, setChart] = useState();
  const [inputedDate, setInputedDate] = useState({
    firstDate: "",
    secondDate: "",
  });

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
        const dateArr = entries.map((currentArr) => currentArr[0]);
        const filteredArr = dateArr.filter((currentElement) => {
          if (
            currentElement === new Date(inputedDate.firstDate) ||
            currentElement === new Date(inputedDate.secondDate)
          ) {
            return currentElement;
          }
        });
        setDates(filteredArr);

        setPrices(entries.map((currentArr) => currentArr[1]));

        console.log(filteredArr);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();

    console.log("data do input", inputedDate);
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

  function handleFirstDateChange(event) {
    setInputedDate({
      firstDate: event.target.value,
      secondDate: inputedDate.secondDate,
    });
    console.log(inputedDate);
  }

  function handleSecondDateChange(event) {
    setInputedDate({
      firstDate: inputedDate.firstDate,
      secondDate: event.target.value,
    });
    console.log(inputedDate);
  }

  return (
    <div id="canvasChart">
      <DateInput onChange={handleFirstDateChange} name={"firstDate"} />
      <DateInput onChange={handleSecondDateChange} name={"secondDate"} />
      <canvas id="myChart" width="1100" height="450"></canvas>
    </div>
  );
}

export default MyChart;
