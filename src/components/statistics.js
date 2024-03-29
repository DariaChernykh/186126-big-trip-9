import AbstractComponent from "./abstract-component";
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import {TYPES} from "../data";

const transfers = TYPES.transfers;

export default class Stats extends AbstractComponent {
  constructor() {
    super();
    this.labels = [];
    this.prices = [];
    this.transportNames = [];
    this.transportTimes = [];
    this.placesNames = [];
    this.placesTime = [];
    this.transport = {};
    this.moneyChart = ``;
    this.transportChart = ``;
    this.moneyCtx = document.querySelector(`.statistics__chart--money`);
    this.transportCtx = document.querySelector(`.statistics__chart--transport`);
    this.timeCtx = document.querySelector(`.statistics__chart--time`);

  }
  getTemplate() {
    return `<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
  }

  updateData(arr) {
    this._prepareData(arr);
    this.moneyChart.data.datasets[0].data = this.prices;
    this.moneyChart.data.labels = this.labels;
    this.transportChart.data.datasets[0].data = this.transportTimes;
    this.transportChart.data.labels = this.transportNames;
    this.timeChart.data.datasets[0].data = this.placesTime;
    this.timeChart.data.labels = this.placesNames;

    this.moneyChart.update();
    this.transportChart.update();
    this.timeChart.update();
  }

  _prepareData(arr) {
    this.labels = [];
    this.prices = [];
    this.transportNames = [];
    this.transportTimes = [];
    this.placesNames = [];
    this.placesTime = [];
    for (let key in this.transport) {
      if (Object.prototype.hasOwnProperty.call(this.transport, key)) {
        this.transport[key] = 0;
      }
    }

    arr.forEach((point) => {
      const curIndex = this.labels.findIndex((elem) => elem === point.type);
      if (curIndex === -1) {
        this.labels.push(point.type);
        this.prices.push(point.price);
      } else {
        this.prices[curIndex] += point.price;
      }

      const duration = Math.round(moment.duration(moment(point.dateTo).diff(moment(point.dateFrom))).asHours());
      const curIndexPlace = this.placesNames.findIndex((elem) => elem === point.destination.name);
      if (curIndexPlace === -1 && duration > 0) {
        this.placesNames.push(point.destination.name);
        this.placesTime.push(duration);
      } else {
        this.placesTime[curIndexPlace] += duration;
      }

      if (transfers.indexOf(point.type) >= 0) {
        if (!this.transport.hasOwnProperty(point.type)) {
          this.transport[point.type] = 1;
        } else {
          this.transport[point.type] += 1;
        }
      }
    });

    this.prices.forEach((value, index) => {
      if (value === 0) {
        this.labels.splice(index, 1);
        this.prices.splice(index, 1);
      }
    });

    for (let key in this.transport) {
      if (Object.prototype.hasOwnProperty.call(this.transport, key)) {
        if (this.transport[key] === 0) {
          delete this.transport[key];
        } else {
          this.transportNames.push(key);
          this.transportTimes.push(this.transport[key]);
        }
      }
    }
  }

  generateCharts(arr) {
    this._prepareData(arr);
    this.moneyChart = new Chart(this.moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this.labels,
        datasets: [{
          data: this.prices,
          backgroundColor: [
            `rgba(255, 99, 132, 0.2)`,
            `rgba(54, 162, 235, 0.2)`,
            `rgba(255, 206, 86, 0.2)`,
            `rgba(75, 192, 192, 0.2)`,
            `rgba(153, 102, 255, 0.2)`,
            `rgba(255, 159, 64, 0.2)`
          ],
          borderColor: [
            `rgba(255, 99, 132, 1)`,
            `rgba(54, 162, 235, 1)`,
            `rgba(255, 206, 86, 1)`,
            `rgba(75, 192, 192, 1)`,
            `rgba(153, 102, 255, 1)`,
            `rgba(255, 159, 64, 1)`
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `€ ${val}`,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
        },
        elements: {
          rectangle: {
            borderSkipped: `left`,
          }
        },
        title: {
          display: true,
          text: `Money`,
          position: `left`,
          fontSize: 20,
          fontFamily: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
        },
        legend: {
          display: false
        }
      }
    });
    this.transportChart = new Chart(this.transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this.transportNames,
        datasets: [{
          data: this.transportTimes,
          backgroundColor: [
            `rgba(255, 99, 132, 0.2)`,
            `rgba(54, 162, 235, 0.2)`,
            `rgba(255, 206, 86, 0.2)`,
            `rgba(75, 192, 192, 0.2)`,
            `rgba(153, 102, 255, 0.2)`,
            `rgba(255, 159, 64, 0.2)`
          ],
          borderColor: [
            `rgba(255, 99, 132, 1)`,
            `rgba(54, 162, 235, 1)`,
            `rgba(255, 206, 86, 1)`,
            `rgba(75, 192, 192, 1)`,
            `rgba(153, 102, 255, 1)`,
            `rgba(255, 159, 64, 1)`
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}x`,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
        },
        elements: {
          rectangle: {
            borderSkipped: `left`,
          }
        },
        title: {
          display: true,
          text: `Transport`,
          position: `left`,
          fontSize: 20,
          fontFamily: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
        },
        legend: {
          display: false
        }
      }
    });
    this.timeChart = new Chart(this.timeCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: this.placesNames,
        datasets: [{
          data: this.placesTime,
          backgroundColor: [
            `rgba(255, 99, 132, 0.2)`,
            `rgba(54, 162, 235, 0.2)`,
            `rgba(255, 206, 86, 0.2)`,
            `rgba(75, 192, 192, 0.2)`,
            `rgba(153, 102, 255, 0.2)`,
            `rgba(255, 159, 64, 0.2)`
          ],
          borderColor: [
            `rgba(255, 99, 132, 1)`,
            `rgba(54, 162, 235, 1)`,
            `rgba(255, 206, 86, 1)`,
            `rgba(75, 192, 192, 1)`,
            `rgba(153, 102, 255, 1)`,
            `rgba(255, 159, 64, 1)`
          ],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 13,
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
            formatter: (val) => `${val}H`,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true
            }
          }],
        },
        elements: {
          rectangle: {
            borderSkipped: `left`,
          }
        },
        title: {
          display: true,
          text: `Time Spent`,
          position: `left`,
          fontSize: 20,
          fontFamily: `'Helvetica Neue', 'Helvetica', 'Arial', sans-serif`,
        },
        legend: {
          display: false
        }
      }
    });
  }
}
