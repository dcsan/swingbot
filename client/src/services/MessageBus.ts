import {
  from, of, asyncScheduler,
  BehaviorSubject,
} from 'rxjs'

import { mergeMap, delay } from 'rxjs/operators';

// import { of } from 'rxjs/observable/of';
// import { mergeMap } from 'rxjs/operator/mergeMap'

// import * as mergeMap from 'rxjs/add/operator/mergeMap'

const subscriber = new BehaviorSubject(0)

const MessageBus = {

  subscriber: subscriber,

  // log() {
  //   console.log('rawlog')
  //   subscriber
  //     .throttleTime(1000)
  //     .scan(count => count + 1, 0)
  //     .subscribe(count => console.log(`Clicked ${count} times`));
  // },

  log(msg: any) {
    console.log('log', msg)
  },

  generate() {
    let streamData = []
    for (let x = 0; x < 10; x++) {
      streamData.push( {x: x, delay: x * 1000} )
    }
    let mockSource$ = from(streamData).pipe(
      mergeMap((notif) => {
        return of(notif).pipe(delay(notif.delay));
      }),
    )

    mockSource$.subscribe(MessageBus.log);

  },

  messageService: {
    send: function (msg: any) {
      console.log('messageService.send', msg)
      subscriber.next(msg)
    }
  },

  animate() {
    console.log('start anim')
    setInterval( () => {
      MessageBus.messageService.send(1)
    }, 1000)
  }

}

export default MessageBus


// export {
//   messageService,
//   subscriber
// }
