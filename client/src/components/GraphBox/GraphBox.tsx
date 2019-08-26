import React, { useEffect, useState } from "react";
import axios from "axios"
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// The wrapper exports only a default component class that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props). All other
// interfaces like Options come from the Highcharts module itself.

// const options: Highcharts.Options = {
//     title: {
//         text: 'My chart'
//     },
//     series: [{
//         type: 'line',
//         data: [1, 2, 3]
//     }]
// }

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



export default function GraphBox() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("/tx/last")
      .then(result => {
        console.log('result', result)
        setData( result.data )
      });
  }, []);

  return (
    <div>
      stuff
        {data.map( (item) => (
          <li key={item.idx}>
            {item.open}
          </li>
        ))}

    </div>
  );
}


