const path = require('path')
const fs = require('fs')
var csvWriter = require('csv-write-stream')


import {
  Kalk,
  IKalk
} from '../lib/Kalk'

interface ITrade {
  in: number
  active: boolean
  type: string
  out?: number
  profit?: number
}

interface IResult {
  didAction: string
  reason: string
  trade?: ITrade
}

interface IBotState {
  counter: number
  total: number
}

const STACK_SIZE = 5

class MoodyBot {
  prices: number[] = []
  trade: ITrade = {
    type: 'OPEN',
    in: 0,
    out: 0,
    active: false,
    profit: 0
  }
  state: IBotState = {
    total: 0,
    counter: 0
  }
  logger: any // streamWriter

  constructor() {
    let fileName = 'tradeLog.csv'
    const fp = path.join(__dirname, '../../data', fileName)
    let options = {
      headers: [
        'counter',
        'last1', 'last2', 'diff1', 'dir', 'miniChart', 'swing',
        'action',
        'reason', 'didAction',
        'active', 'in', 'out', 'profit',
        'total'
      ]
    }

    let logger = csvWriter(options)
    let stream = fs.createWriteStream(fp)
    logger.pipe(stream)
    this.logger = logger
  }

  tick(price: number) {
    this.state.counter++
    this.prices.push(price)
    this.prices = this.prices.slice(- STACK_SIZE)
    let calc: IKalk = Kalk.calcAll(this.prices)
    let result: IResult
    switch (calc.action) {
      case 'BUY':
        result = this.buy(calc)
        break
      case 'SELL':
        result = this.sell(calc)
        break
      default:
        result = this.hold(calc)
    }
    this.logTick(calc, result)
    return ({
      calc,
      result,
    })
  }

  buy(calc: IKalk): IResult {
    if (this.trade.active) {
      let result: IResult = {
        didAction: 'HOLD',
        reason: 'BUY-AH'
      }
      return result
    }
    // else buy
    this.trade = {
      type: 'BUY',
      in: calc.last1,
      active: true
    }
    return {
      didAction: 'BUY',
      reason: 'BUY-CMD',
      trade: this.trade
    }
  }

  sell(calc: IKalk): IResult {
    if (!this.trade.active) {
      let result: IResult = {
        didAction: 'NONE',
        reason: 'SELL-NH'
      }
      return result
    } // else sell
    this.trade.out = calc.last1
    this.trade.profit = this.trade.out - this.trade.in
    this.state.total += this.trade.profit
    this.trade.active = false
    this.trade.type = 'CLOSED'
    return {
      didAction: 'SELL',
      reason: 'SELL-CMD',
      trade: this.trade
    }
  }

  hold(calc: IKalk): IResult {
    // console.log('hold.calc', calc)
    return {
      didAction: 'HOLD',
      reason: 'HOLD-CMD'
    }
  }

  logTick(calc: IKalk, result: IResult) {
    // console.log('merging', calc, result, this.trade, this.state) // check no collisions
    let obj = Object.assign(calc, this.trade, result, this.state)
    this.logger.write(obj)
  }

}

export default MoodyBot

