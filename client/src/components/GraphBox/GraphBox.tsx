import React, { useState, useEffect } from 'react';
import axios from 'axios';
import deepmerge from 'deepmerge'

import './GraphBox.css'

// import React, { useEffect, useState } from "react";
// import axios from "axios"
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// The wrapper exports only a default component class that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props). All other
// interfaces like Options come from the Highcharts module itself.


// // React supports function components as a simple way to write components that
// // only contain a render method without any state (the App component in this
// // example).

// const GraphBox = (props: HighchartsReact.Props) => <div>
//   <HighchartsReact
//       highcharts={Highcharts}
//       options={options}
//       {...props}
//   />
// </div>

const graphOptions = {
  title: {
    text: 'SwingBot'
  },
  subtitle:
  {
    text: 'test run'
  }
}

// interface ISeriesData {
//   type: string,
//   data: number[]
// }

// interface ITX {
//   open: number
//   idx: number
//   options: Highcharts.Options
// }

// const seriesData = [{
//   type: 'line',
//   data: [1, 2, 3]
// }]

interface IRunData {
  chartOptions: Highcharts.Options
  botRun: IBotRun
}
interface IBotRun {
  title: string
}


function GraphBox() {

  // const [data, setData] = useState(data: {} as IRunData);
  // const [data, setData] = useState<null | {albums: any}>(null);
  const [data, setData] = useState({ botRun: {} as IBotRun, chartOptions: {} as Highcharts.Options });

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        '/tx/last',
      );

      // console.log('result.data', result.data)
      console.log('result.data.botRun', result.data.botRun)
      // console.log('result.data.chartOptions', result.data.chartOptions)
      // let data = Object.assign(result.data, graphOptions)
      // let data = Object.assign(result.data, {})
      let chartOptions  = deepmerge(graphOptions, result.data.chartOptions) as Highcharts.Options
      // console.log('chartOptions', chartOptions)
      setData({botRun: result.data.botRun, chartOptions});
    };
    fetchData();
  }, [] );

  // let seriesData = data.botRun.chartOptions.series[0].data

  if (!data) {
    return<div>loading...</div>
  }

  console.log('render chartOptions', data.chartOptions)
  // const colors = Highcharts.getOptions().colors
  // console.log('colors', colors)


  return (
    <div>

      <HighchartsReact
        highcharts={Highcharts}
        options={ data.chartOptions }
        containerProps = {{ className: 'chartContainer' }}
        // {...props}
      />

      {/* { seriesData.map( (elem: any) => {
        return(<div key={elem.idx}>{elem.open}</div>)
      }) } */}
    </div>
  );
}
export default GraphBox;

