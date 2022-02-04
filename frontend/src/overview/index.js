import { Link } from 'react-router-dom';
import Topbar from '../topbar/index'
import './index.css'
import Chart from "react-apexcharts";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setInvoice } from '../redux/Invoice';
import { Api } from '../Api';


function Home() {
  const dispatch = useDispatch();
  const { invoice } = useSelector((state) => state.invoice)

const [chart, setChart] = useState({      options: {
  chart: {
    height: 350,
    type: "line",
    stacked: false
  },
  xaxis: {
    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
  }
},
series: [
  {
    name: "series-1",
    data: [30, 40, 45, 50, 49, 60, 70, 91]
  }
]
})

const [progressChart, setProgressChart] = useState({
  series: [0],
  options: {
    chart: {
      height: 350,
      type: 'radialBar',
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: '70%',
        }
      },
    },
    labels: ['Betalda'],
  },
})

useEffect(() => { Api.get('invoice/invoices/')
.then(response => dispatch(setInvoice(response.data)))
},[dispatch])


return (
    <>
      <div className="main-window">
        <h2>Finansiell överiskt</h2>
      <div className="money-data-container">
        <span className="border-right-green">
          <h6>Summa inbetalningar</h6>
          <h4>{invoice.filter(({status}) => status === 2).reduce((a,v) =>  Math.floor(a) +  Math.floor(v.total), 0)} kr</h4>
        </span>

        <span>
          <h6>Utestående betalningar</h6>
          <h4>{invoice.filter(({status}) => status === 0 || status === 1 ).reduce((a,v) =>  Math.floor(a) +  Math.floor(v.total), 0)} kr</h4>
        </span>
      </div>
    <div className="data-chart">
      <h5>Inbetalningar</h5>
    <Chart options={chart.options} series={chart.series} type="line" width="100%" height={320} />
    </div>

    <div className="data-chart-container row">
    <div className="data-chart-radial">
      <h5>Utestående betalningar</h5>
    <Chart options={progressChart.options} series={progressChart.series} type="radialBar" height={320} />
    </div>
    <div className="data-chart-radial">
      <h5>Utestående betalningar</h5>
    <Chart options={progressChart.options} series={progressChart.series} type="radialBar" height={320} />
    </div>
    </div>

      </div>

  </>
  );
}

export default Home;
