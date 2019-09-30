import React from 'react';
import './Home.css';

import GraphBox from "../../components/GraphBox/GraphBox"

const App: React.FC = () => {
  return (
    <div className="App">
      <div>
        <h2>TraderBot | Home</h2>
        <GraphBox></GraphBox>
      </div>
    </div>
  );
}

export default App;
