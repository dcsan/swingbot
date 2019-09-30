import React, { Component } from 'react';

import MessageBus from '../../services/MessageBus'

class Panel extends Component<{}, any>  {

  constructor(props: any) {
    super(props)
    this.state = {
      number: 1 as Number
    }
  }

  componentDidMount() {
    MessageBus.subscriber.subscribe((val: any) => {
      let {number} = this.state
      this.setState({ number: number + val })
      console.log('panel.val', val)
    });
  }

  render() {
    console.log('render.state', this.state)
    let number = this.state.number || 0
    return (
      <div className='panel-box'>
        panel
        <h3>{ number }</h3>
      </div>
    )
}
}

export default Panel
