import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from '../components/Header/Header'

import Graph from './Graph/Graph'
import Live from './Live/Live'

const Top = () => {
  return (<h2>Top</h2>)
}


const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <Header></Header>
        <Route path="/" exact={true} component={ Top } />
        <Route path="/graph" component={ Graph } />
        <Route path="/live" component={ Live } />
      </Router>
    </div>
  );
}

export default App;
