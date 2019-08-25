import Logger from '../lib/Logger'
const logger = new Logger('MoodyBot')

const path = require('path')
const fs = require('fs')
var csvWriter = require('csv-write-stream')

import {
  IPrice
} from '../types/types'

import {
  Kalk,
  IKalkConfig,
  IKalk
} from '../lib/Kalk'

interface IBotConfig {
  logfile?: string
  calcConfig: IKalkConfig
}

interface ITrade {
  in: number
  active: boolean
  type: string
  out?: number
  profit?: number
  delta?: number
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
  txLogger: any // streamWriter
  calco: Kalk

  constructor(config: IBotConfig ) {
    this.txLogger = this.createLogger(config)
    this.calco = new Kalk(config.calcConfig)
  }

  createLogger(config: IBotConfig): any {
    let logfile = config.logfile || 'tradeLog.csv'
    const logPath = path.join(__dirname, '../../logs', logfile)
    let options = {
      headers: [
        'gdate',
        'last1', 'last2',
        'diff1',
        'dir', 'miniChart',
        'swing',
        'action', 'reason', 'didAction',
        'active', 'in', 'out', 'profit',
        'delta',   // active trade
        'total',
        'counter',
        'idx',
      ]
    }
    try {
      fs.unlinkSync(logPath)
    } catch (err) {
      logger.warn('no log file existed', logPath)
    }
    let txLogger = csvWriter(options)
    let stream = fs.createWriteStream(logPath)
    txLogger.pipe(stream)
    return txLogger
  }

  tick(ip: IPrice) {
    let price = ip.open
    this.state.counter++
    this.prices.push(price)
    this.prices = this.prices.slice(- STACK_SIZE)
    let calc: IKalk = this.calco.calcAll(this.prices)
    let result: IResult
    switch (calc.action) {
      case 'BUY':
        result = this.buy(calc)
        break
      case 'SELL':
        result = this.sell(calc)
        break
      case 'HOLD':
        result = this.hold(calc)
        break
      default:
        result = this.sleep(calc)
    }

    if (this.trade.active) {
      this.trade.delta = this.trade.in - price
    } else {
      this.trade.delta = 0
    }

    this.logTick(calc, result, ip)
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
    let result
    if (this.trade.active) {
       result = {
         didAction: 'HOLD',
         reason: 'HOLD-CMD'
      }
    } else {
      result = {
        didAction: '-',
        reason: 'HOLD-CMD'
      }
    }
    return result
  }

  sleep(calc: IKalk): IResult {
    let result: IResult = {
      didAction: '-',
      reason: 'SLEEP'
    }
    return result
  }

  logTick(calc: IKalk, result: IResult, ip: IPrice) {
    // console.log('merging', calc, result, this.trade, this.state) // check no collisions
    let obj = Object.assign(ip, calc, this.trade, result, this.state)
    this.txLogger.write(obj)
  }

}

export {
  IBotConfig,
  MoodyBot
}

