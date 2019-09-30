import React, { Component } from 'react';
import './Live.css';

// https://reactrocket.com/post/react-and-rxjs/

import { Subject } from 'rxjs'

const counter = new Subject();

// counter.subscribe((evt) => {
//   console.log(`evt: ${ evt }`)
// })



class Live extends Component<{}, any>  {

  constructor(props: any) {
    super(props)
    this.state = {
      number: 1 as Number
    }
    this.clicked = this.clicked.bind(this)
  }

  clicked() {
    console.log('clicked', this.state)
    counter.next(1)
  }

  componentDidMount() {
    // We update the state in our subscribe callback from the counter stream

    counter.subscribe((val: any) => {
      console.log('sub.val', val)
      this.setState({ number: this.state.number + val })
    });
  }

  render() {
    console.log('render.state', this.state)
    let num = this.state.number || 0
    return (
      <div className="App">
      <h2>Live</h2>
      <h3>{ num }</h3>
      <button onClick={ this.clicked }>next</button>
    </div>
  )
}
}

export default Live
