import React from 'react';
import './Graph.css';

import GraphBox from "../../components/GraphBox/GraphBox"

const App: React.FC = () => {
  return (
    <div className="App">
      <div>
        <h2>Graph</h2>
        <GraphBox></GraphBox>
      </div>
    </div>
  );
}

export default App;
