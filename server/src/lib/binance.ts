const chalk = require('chalk')

const Binance = require('binance-api-node').default
import AppConfig from "../config/AppConfig"

const INTERVAL = 1000
const DIFFMULTI = 10000 // make diff visible
const STACK_LENGTH = 5
const STEP_OUT = 0.001    // to confirm a swing diff from inpoint
const STOP_AMT = 0.1      // hold for stops

let fs = require("fs")
const jsonlines = require('jsonlines')
const stringifier = jsonlines.stringify()


// Authenticated client, can make signed calls
const binClient = Binance({
  apiKey: AppConfig.BinApiKey,
  apiSecret: AppConfig.BinApiSecret
  // getTime: xxx // time generator function, optional, defaults to () => Date.now()
})


// const log = function (...args: any) {
  // nothing
// }

const log = function (...args: any) {
  console.log(...args)
  args[0] += '\n'
  Logs.textLog.write(...args)
}

const swingDur = 2      // seconds
const swingVal = 0.5    // amount

interface ISnap {
  time: number,
  timeDiff: number,
  price: number,
  priceDiff: number,
  dir: number,
  dirArrow?: string,
  swing: number,
  swingArrow?: string
  msg?: string
  action?: string
  run?: string
  tx: ITX
}

interface IPrice {
  price: number
  time?: number
}

interface ITX {
  action?: string  // BUY/SELL
  in?: IPrice
  out?: IPrice
  profit?: IPrice
  totalProfit?: {
    amount: number
  }
  msg?: string
}

// vars

let lastSnap: ISnap

let state = {
  holding: false as boolean,
  inPrice: 0 as number,
  outPrice: 0 as number,
  snap: {} as ISnap,
  totalProfit: 0 as number, // cumulative
  tradeCount: 0 as number,
  txLog: [] as ITX[]
}

const Logs = {
  textLog: fs.createWriteStream('./data/text.log', { flags: 'a' }),
  txLog: fs.createWriteStream('./data/tx.json', { flags: 'a' }),
  jsonLog: fs.createWriteStream('./data/json.log', { flags: 'a' }),
}

let bot = {
  stack: [] as ISnap[],
  count: 0,
}

const BinLib = {

  calcRun(): string {
    let lastPrice = 0
    let run = bot.stack.map((snap: ISnap) => {
      let arrow = BinLib.arrowFor(snap.priceDiff)
      lastPrice = snap.price
      return arrow
    })
    run.shift() // remove first elem
    return run.join('')
  },

  arrowFor(val: number) {
    if (val < 0) { return BinLib.downArrow()}
    if (val > 0) { return BinLib.upArrow() }
    return '-'
  },

  upArrow() {
    return chalk.green("⬆︎")
  },
  downArrow() {
    return chalk.red("⬇︎︎")
  },

  logit(snap: ISnap) {
    bot.count++
    // if (BinLib.count % 20 === 1) {
    //   BinLib.textLog.write(`time\t\tprice\t\tdiff\tdir\tswing\tmsg\n`)
    // }

    let fields = [
      snap.price,
      snap.priceDiff,
      snap.dirArrow,
      snap.swingArrow,
      snap.run,
      snap.tx.action
    ]
    let line = fields.join('\t')
    Logs.textLog.write(line)
    // let line = `${ snap.priceDiff }\t${snap.dir} ${snap.dirArrow}\t${snap.swing}\t${snap.run}\t${snap.tx.action} \t${snap.msg}`
    log(line)
    Logs.textLog.write(line)
    if (snap.timeDiff > 100) {
      // dont write jitter or first run
      stringifier.write(snap)
    }
  },

  swing(dir: string) {
    log(dir)
  },

  logTransaction(tx: ITX) {
    log('tx', tx)
  },

  checkStop(snap: ISnap): ITX | boolean {
    if (snap.price < (state.inPrice - STOP_AMT)) {
      return BinLib.sell(snap, 'STOP')
    }
    return false
  },

  buy(snap: ISnap): ITX {
    let tx: ITX = {
      in: {
        price: snap.price
      }
    }
    if (state.holding) {
      // log('already holding, cannot buy')
      tx.action = 'HOLD'
    } else {
      // else
      tx.action = 'BUY'
      state.holding = true
      state.inPrice = snap.price
      state.snap = snap
      // BinLib.logTransaction(tx)
    }
    return tx
  },

  sell(snap: ISnap, why?: string): ITX {
    let tx: ITX = {
      in: { price: state.inPrice },
    }
    if (!state.holding) {
      tx.action = 'MISS'
      return tx
    }

    state.holding = false
    let profit = snap.price - state.inPrice
    state.totalProfit += profit
    tx = {
      action: why || 'SELL',
      in: { price: state.inPrice },
      out: { price: snap.price },
      profit: { price: profit },
      totalProfit: {
        amount: state.totalProfit
      }
    }
    log('profit:', profit)
    state.txLog.push(tx)
    // log(tx)
    return tx
  },

  checkSwing(snap: ISnap): ISnap {

    if (bot.stack.length < 5) {return snap}
    bot.stack = bot.stack.slice(0, STACK_LENGTH)
    // log('stack', bot.stack)
    let [e0, e1, e2, e3, e4] = bot.stack
    let [p0, p1, p2, p3, p4] = [e0.price, e1.price, e2.price, e3.price, e4.price]
    let swing = 0
    // log('prices', p0, p1, p2)
    if (p0 < p1) {
      snap.dir = 1
    }
    if (p0 > p1) {
      snap.dir = -1
    }
    if (
      p0 > p1 &&
      p1 < p0 &&
      p2 < (p0 + STEP_OUT)
      ) {
      swing = 1
      snap.action = `BUY`
      snap.msg = `BUY @ ${snap.price}`
      snap.tx = BinLib.buy(snap)
    }
    if (
      p0 < p1 &&
      p1 > p0 &&
      p2 < (p0 - STEP_OUT)
    ) {
      swing = -1
      snap.action = 'SELL'
      snap.msg = `SELL ${snap.price}`
      snap.tx = BinLib.sell(snap)
    }
    snap.swing = swing
    snap.swingArrow = BinLib.arrowFor(swing)
    return snap
  },

  checkSnap: async () => {
    try {
      let sym = await binClient.avgPrice({ symbol: 'BTCUSDT' })
      if (!lastSnap) {
        lastSnap = sym
        return
      }
      const time = Date.now()
      const price = parseFloat(sym.price)
      const priceDiff = Math.round(DIFFMULTI * (price - lastSnap.price))
      const timeDiff = time - lastSnap.time
      let snap: ISnap = {
        time,
        timeDiff,
        price,
        priceDiff,
        dir: 0,
        swing: 0,
        msg: '',
        tx: {
          action: '-'
        }
      }
      let tx = BinLib.checkStop(snap)
      snap = BinLib.checkSwing(snap)
      snap.swingArrow = '⇕' + BinLib.arrowFor(snap.swing)
      snap.dirArrow = 'Δ' + BinLib.arrowFor(snap.priceDiff)
      bot.stack.unshift(snap)
      snap.run = BinLib.calcRun()

      BinLib.logit(snap)
      lastSnap = snap
    } catch (err) {
      console.error(err)
    }
  },

  watch: async () => {
    BinLib.checkSnap()
    setInterval(BinLib.checkSnap, INTERVAL)
    stringifier.pipe(Logs.jsonLog)
  }

}

export default BinLib