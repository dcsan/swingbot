import { BehaviorSubject } from 'rxjs'

const MessageBus = {

  subscriber: new BehaviorSubject(0),

  messageService: {
    send: function (msg: any) {
      console.log('messageService.send', msg)
      MessageBus.subscriber.next(msg)
    }
  }

}

export default MessageBus


// export {
//   messageService,
//   subscriber
// }
