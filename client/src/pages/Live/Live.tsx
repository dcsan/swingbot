import React, { Component } from 'react';
import './Live.css';

import Panel from '../../components/Panel/Panel'

// https://reactrocket.com/post/react-and-rxjs/

// import { Subject } from 'rxjs'
// const counter = new Subject();
// counter.subscribe((evt) => {
//   console.log(`evt: ${ evt }`)
// })

import MessageBus from '../../services/MessageBus'

class Live extends Component<{}, any>  {

  constructor(props: any) {
    super(props)
    this.state = {
      number: 1 as Number
    }
  }

  componentDidMount() {
    // We update the state in our subscribe callback from the counter stream

    MessageBus.subscriber.subscribe((val: any) => {
      let {number} = this.state
      this.setState({ number: number + val })
      console.log('sub.val', val)
    });
  }

  render() {
    console.log('render.state', this.state)
    let number = this.state.number || 0
    return (
      <div className="App">
      <h2>Live</h2>
        <h3>{ number }</h3>
        <Panel></Panel>
      <button onClick={ (e) => MessageBus.messageService.send(1) }>next</button>
    </div>
  )
}
}

export default Live
