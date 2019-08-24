import lodash from "lodash"
import BotLog from "../lib/LogBot"
import SnapLog from '../models/SnapLog'
import TraderLib from '../lib/TraderLib'
import TxLog from "../models/TxLog"

import {
  ISnap,
  ITX,
  IPrice,
  IBotState
} from "../types/types"

const INTERVAL = 1000
const STACK_LENGTH = 10
const STEP = 0.0001    // to confirm a swing diff from inpoint
const STOP_AMT = 0.1      // hold for stops

import binClient from "../adapters/Binance"

// delta
const dt = (p0: number, p1: number) => {
  return p1 - p0
}

// const log = function (...args: any) {
  // nothing
// }

// const log = function (...args: any) {
//   console.log(...args)
//   args[0] += '\n'
//   Logs.textLog.write(...args)
// }

const swingDur = 2      // seconds
const swingVal = 0.5    // amount


// vars

let lastSnap: ISnap

let state: IBotState = {
  holding: false,
  inPrice: 0,
  outPrice: 0 as number,
  snap: {} as ISnap,
  total: 0,
  tradeCount: 0,
}


let bot = {
  stack: [] as ISnap[],
  count: 0,
}

const logBot = new BotLog()
let count = 0

const SwingBot = {

  calcRun(): string {
    let lastPrice = 0
    let run = bot.stack.map((snap: ISnap) => {
      let arrow = logBot.arrowFor(snap.lastDiff)
      lastPrice = snap.price
      return arrow
    })
    // run.shift() // remove first elem
    return run.join('')
  },

  // swing(dir: string) {
  //   log(dir)
  // },

  // logTransaction(tx: ITX) {
  //   log('tx', tx)
  // },

  async doBuy(snap: ISnap): Promise<ISnap> {
    let tx: ITX = {
      action: 'BUY',
      in: snap.price,
      snap
    }
    if (state.holding) {
      snap.result = 'NG-AH' // Already Holding
    } else {
      snap.result = 'OK'
      snap.msg = `BUY  @ ${snap.price}`
      // else
      tx.action = 'BUY'
      state.holding = true
      state.inPrice = snap.price
      state.snap = snap
      // SwingBot.logTransaction(tx)
    }
    await TxLog.write(tx)
    return snap
  },

  async doSell(snap: ISnap, why?: string): Promise<ISnap> {
    let take = snap.price - state.inPrice
    const points = TraderLib.calcPoints(take)
    if (!state.holding) {
      snap.result = 'NG-NH' // not holding
    } else {
      snap.result = 'OK'
      snap.take = take
      state.holding = false
      state.total += take
      snap.msg = `SELL @ ${ snap.price }`

      let tx: ITX = {
        action: why || 'SELL',
        result: snap.result,
        reason: snap.reason,
        take: take,
        in: state.inPrice,
        out: snap.price,
        points,
        total: state.total,
        history: snap.run,
        priceHistory: bot.stack.map(elem => elem.price),
        snap
      }

      await TxLog.write(tx)

    }
    return snap
  },

  checkStop(snap: ISnap): ISnap {
    if (snap.price < (state.inPrice - STOP_AMT)) {
      snap.action = 'SELL'
      snap.reason = 'STOP'
      // state.inPrice = snap.price  // prevent loop of 'stops'
    }
    return snap
  },

  // ride on breakout up?
  checkRide(snap: ISnap): ITX | undefined {
    if (snap.price < (state.inPrice - STOP_AMT)) {
      snap.action = 'SELL'
    }
    return snap
  },

  checkSwing(snap: ISnap, stack: ISnap[]): ISnap {
    if (stack.length < 5) {return snap}

    // easier to count forward
    let calcStack = lodash.clone(stack)
    calcStack.reverse()

    // console.log('stack', bot.stack)
    let prices: number[] = []
    let diffs: number[] = []
    snap.swing = 0
    bot.stack.map( (one, idx) => {
      prices[idx] = one.price
    })
    prices.forEach((price, idx) => {
      diffs[idx] = (prices[idx] - prices[idx + 1])
      // console.log(idx, price)
    })

    snap.diffPoints = diffs.map(d => TraderLib.calcPoints(d))
    snap.lastDiff = snap.diffPoints[0] // display
    snap.prices = prices
    // diffs.pop() // last value
    snap.diffs = diffs

    if (diffs[0] < -STEP) {
      snap.dir = -1
    } else if (diffs[0] > STEP) {
      snap.dir = 1
    } else {
      snap.dir = 0
    }

    snap.run = SwingBot.calcRun()
    switch (true) {
      case /UUDD$/.test(snap.run):
        snap.action = 'SELL'
        snap.reason = 'SW-DN'
        break
      case /DDUU$/.test(snap.run):
        snap.action = 'BUY'
        snap.reason = 'SW-UP'
        break
      case /UUU$/.test(snap.run):
        snap.action = 'BUY'
        snap.reason = 'RD-UP'
        break
      case /DDD$/.test(snap.run):
        snap.action = 'SELL'
        snap.reason = 'RD-DN'
        break

    }

    // if (
    //   diffs[0] > STEP &&
    //   diffs[1] < -STEP &&
    //   diffs[2] < -STEP
    // ) {
    //   snap.swing = -1
    //   snap.action = `SELL`
    // }

    // if (
    //   diffs[0] < -STEP &&
    //   diffs[1] > STEP &&
    //   diffs[2] > STEP
    // ) {
    //   snap.swing = +1
    //   snap.action = `BUY`
    // }

    return snap
  },

  tick: async () => {
    count++
    try {
      let sym = await binClient.avgPrice({ symbol: 'BTCUSDT' })
      if (!lastSnap) {
        lastSnap = sym
        return
      }
      const time = Date.now()
      const price = parseFloat(sym.price)
      const timeDiff = time - lastSnap.time
      const secs = Math.round((time / 1000) % 60)
      const delta = price - state.inPrice
      let snap: ISnap = {
        secs,
        count,
        time,
        timeDiff,
        price,
        delta
      }
      bot.stack.push(snap) // insert
      // bot.stack = bot.stack.slice(1, STACK_LENGTH)
      if (bot.stack.length > STACK_LENGTH) {
        bot.stack.shift() // remove first/oldest member
      }
      snap = SwingBot.checkSwing(snap, bot.stack)
      if (!snap.action) {
        snap = SwingBot.checkStop(snap)
      }
      switch (snap.action) {
        case 'BUY':
          snap = await SwingBot.doBuy(snap)
          break

        case 'SELL':
          snap = await SwingBot.doSell(snap)
          break
      }

      snap.swingArrow = 'SW:' + logBot.colorize(logBot.arrowFor(snap.swing))
      snap.dirArrow = 'DR:' + logBot.colorize(logBot.arrowFor(snap.lastDiff))

      SnapLog.write(snap)
      logBot.logit(snap)
      lastSnap = snap
    } catch (err) {
      console.error(err)
    }
  },

  init: async () => {
    let tx: ITX = {
      action: 'INIT'
    }
    // await SnapLog.removeAll()
    await TxLog.removeAll()
    await logBot.logTx(tx)
    SwingBot.tick()
    setInterval(SwingBot.tick, INTERVAL)
  }

}

export default SwingBot