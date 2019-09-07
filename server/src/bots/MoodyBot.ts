import Logger from '../lib/Logger'
const logger = new Logger('MoodyBot')
import RikMath from '../lib/RikMath'

import TxLog from '../models/TxLog'

const path = require('path')
const fs = require('fs')
var csvWriter = require('csv-write-stream')

import {
  IPrice,
  IBotConfig,
  IKalkConfig
} from '../types/types'

import {
  Kalk,
  IKalk
} from '../lib/Kalk'

interface IRunReport {
  marketStart?: number
  marketEnd?: number
  marketDeltaVal?: number
  marketDeltaPct?: number
  marketMin: number
  marketMax: number
  marketRange: number
  runProfit: number
  tradeCount?: number
  ticks?: number
  logfile: string
}


interface ITrade {
  type?: string
  active?: boolean
  buy?: number    // FIXME - dont need buy/sell/price
  sell?: number
  tradePrice?: number
  tradeProfit?: number
  delta?: number
  tick?: number
}

interface IResult {
  didAction: string
  reason: string
  trade?: ITrade
}

interface IBotState {
  tick: number
  runProfit: number
  position?: number  // currently held value
  delta?: number     // position vs. price
  price?: number
  tradeCount: number,
  tradeLog: ITrade[]
}

const STACK_SIZE = 6

class MoodyBot {
  prices: number[] = []
  trade: ITrade = {
    type: 'START',
    buy: 0,
    sell: 0,
    active: false,
    tradeProfit: 0
  }
  state: IBotState = {
    runProfit: 0,
    tick: 0,
    tradeCount: 0,
    tradeLog: [],
    position: 0
  }
  csvLogger: any // streamWriter
  calco: Kalk
  report: IRunReport
  config: IBotConfig

  constructor(config: IBotConfig ) {
    // logger.green('IBotConfig=>', config)
    config.logfile = config.logfile || 'tradeLog.csv'
    this.config = config

    this.csvLogger = this.createCsvLogger(config)
    this.calco = new Kalk(config.calcConfig)
    this.report = {
      marketMin: 1e10,  // start with a huge number to go down from
      marketMax: 0,
      marketStart: 0,
      marketEnd: 0,
      runProfit: 0,
      marketRange: 0,
      logfile: config.logfile
    }
  }

  public async init() {
    await TxLog.init()
    await TxLog.removeAll()
  }

  createCsvLogger(config: IBotConfig): any {
    const logPath = path.join(__dirname, '../../logs', config.logfile)
    let options = {
      headers: [
        'tick',
        'gdate',
        'open',
        'last1', 'last2',
        'diff1',
        'dir', 'miniChart',
        'swing',
        'action',
        'didAction',
        'reason',
        'tradeCount',
        'active',
        'last1',
        'position',
        'delta',   // active trade
        'tradePrice',
        'buy',
        'sell',
        'tradeProfit',
        'runProfit',
      ]
    }
    try {
      fs.unlinkSync(logPath)
    } catch (err) {
      logger.warn('no log file existed', logPath)
    }
    let csvLogger = csvWriter(options)
    let stream = fs.createWriteStream(logPath)
    csvLogger.pipe(stream)
    return csvLogger
  }

  // called each tick
  updateReport(price: number) {
    if (this.state.tick === 0) {
      // first tick record market start
      this.report.marketStart = price
    }
    this.report.marketEnd = price   // even if its just one tick
    if (price < this.report.marketMin) this.report.marketMin = price
    if (price > this.report.marketMax) this.report.marketMax = price
  }

  // main update event
  // check for buy/selll
  async tick(ip: IPrice) {
    let price = ip.open || 0  // NOTE - using price.open as the marker
    price = RikMath.fixed(price, 3)
    this.updateReport(price)
    this.prices.push(price)
    this.prices = this.prices.slice(- STACK_SIZE)
    let calc: IKalk = this.calco.calcAll(this.prices)
    if (this.state.position) {
      this.state.delta = RikMath.fixed(calc.last1 - this.state.position!)
    } else {
      this.state.delta = 0  // no delta if no position
    }
    let result: IResult
    switch (calc.action) {
      case 'BUY':
        result = this.buy(calc)
        break
      case 'SELL':
        result = this.sell(calc)
        break
      // case 'HOLD':
      //   result = this.hold(calc)
      //   break
      default:
        result = this.sleep(calc)
    }

    await this.logTick(calc, result, ip)
    this.state.tick++

    return ({
      calc,
      result,
    })
  }

  buy(calc: IKalk): IResult {
    if (this.state.position) {
      let result: IResult = {
        didAction: '-',
        reason: 'BUY-AH'
      }
      this.trade = {} // FIXME code smell
      return result
    }
    // else buy
    const trade: ITrade = {
      type: 'BUY',
      buy: calc.last1,
      tradePrice: calc.last1,
      active: true,
      tick: this.state.tick
    }
    this.state.position = calc.last1
    this.state.tradeCount++
    this.logTrade(trade)
    this.trade = trade
    return {
      didAction: 'BUY',
      reason: 'BUY-CMD',
      trade: this.trade
    }
  }

  sell(calc: IKalk): IResult {
    if (!this.state.position) {
      let result: IResult = {
        didAction: '-',
        reason: 'SELL-NH'
      }
      this.trade = {} // FIXME cleanup holding state
      return result
    } // else sell

    let tradeProfit = RikMath.fixed(calc.last1 - this.state.position)
    this.state.runProfit += tradeProfit
    this.state.runProfit = RikMath.fixed(this.state.runProfit)
    // logger.silly('tradeProfit', tradeProfit)
    // logger.silly('position', this.state.position)
    // logger.silly('calc', calc)

    let trade: ITrade = {
      type: 'SELL',
      sell: calc.last1,
      tick: this.state.tick,
      tradePrice: calc.last1,
      tradeProfit,
      active: false,
    }

    // log before liquidate
    this.logTrade(this.trade)
    this.trade = trade  // FIXME - code smell

    // liquidate
    this.state.position = 0
    this.state.tradeCount++
    return {
      didAction: 'SELL',
      reason: 'SELL-CMD',
      trade: this.trade
    }
  }

  // hold(calc: IKalk): IResult {
  //   let result
  //   this.trade = {}
  //   if (this.state.position) {
  //      result = {
  //        didAction: 'HOLD',
  //        reason: 'HOLD-CMD'
  //     }
  //   } else {
  //     result = {
  //       didAction: '-',
  //       reason: 'HOLD-CMD'
  //     }
  //   }
  //   return result
  // }

  sleep(calc: IKalk): IResult {
    this.trade = {}
    let result: IResult = {
      didAction: '-',
      reason: 'SLEEP'
    }
    return result
  }

  logTrade(trade: ITrade) {
    this.state.tradeLog.push(trade)
  }

  async logTick(calc: IKalk, result: IResult, ip: IPrice) {
    console.log('tick', this.state.tick)
    // console.log('merging', calc, result, this.trade, this.state) // check no collisions
    let obj = Object.assign(ip, calc, this.trade, result, this.state)
    await this.csvLogger.write(obj)  // not async
    await TxLog.log(obj)
  }

  // called at end of run
  makeReport(): IRunReport {
    let report:IRunReport = this.report
    report.runProfit = RikMath.fixed(this.state.runProfit)
    report.tradeCount = this.state.tradeCount
    report.marketDeltaVal = RikMath.fixed(report.marketEnd! - report.marketStart!)
    report.marketDeltaPct = RikMath.pct(report.marketDeltaVal / report.marketStart!)
    report.marketRange = (report.marketMax - report.marketMin)
    report.ticks = this.state.tick
    report.logfile = this.config.logfile!
    this.report = report
    return report
  }

}

export {
  IBotConfig,
  MoodyBot
}

