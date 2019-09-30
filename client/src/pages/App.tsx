import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from '../components/Header/Header'

import Home from './Home/Home'

const Top = () => {
  return (<h1>Top</h1>)
}

const Live = () => {
  return (<h1>Stats</h1>)
}


const App: React.FC = () => {
  return (
    <div className="App">
        <p>
        <Router>
          <Header></Header>
          <Route path="/" exact={true} component={ Top } />
          <Route path="/graph" component={ Home } />
          <Route path="/live" component={ Live } />
        </Router>
        </p>
        common
    </div>
  );
}

export default App;
