import { BehaviorSubject } from 'rxjs'

const subscriber = new BehaviorSubject(0)

const messageService = {
  send: function (msg: any) {
    subscriber.next(msg)
  }
}

export {
  messageService,
  subscriber
}