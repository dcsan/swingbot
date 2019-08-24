let fs = require("fs")
const chalk = require('chalk')

import TxLog from "../models/TxLog"
import TraderLib from '../lib/TraderLib'

const jsonlines = require('jsonlines')

import {
  ISnap,
  ITX,
  IPrice
} from "../types/types"


class BotLog {
  count: number
  logs: any
  stringifier: any

  constructor() {
    this.count = 0
    this.logs = {}
    this.logs.textLog = fs.createWriteStream('./data/text.log', { flags: 'a' })
    this.logs.txLog = fs.createWriteStream('./data/tx.json', { flags: 'a' })
    this.logs.jsonLog = fs.createWriteStream('./data/json.log', { flags: 'a' })
    this.stringifier = jsonlines.stringify()
    this.stringifier.pipe(this.logs.jsonLog)
  }

  arrowFor(val: number | undefined) {
    if(!val || val ===0) return '-'
    if (val < 0) { return this.downArrow()}
    if (val > 0) { return this.upArrow() }
    return '-'
  }
  upArrow() {
    // return chalk.green("⬆︎")
    // return('^')
    return('U')
  }
  downArrow() {
    // return chalk.red("⬇︎︎")
    // return('V')
    return('D')
  }

  colorize(s: string | number) {
    switch (s) {
      case 'U':
      case 1:
        return chalk.green("⬆︎")
      case 'D':
      case -1:
        return chalk.red("⬇︎︎")
      default:
        return chalk.grey(s)
    }
  }

  logit(snap: ISnap) {

    let fields = [
      snap.count,
      snap.price,
      snap.lastDiff,
      snap.dirArrow,
      snap.swingArrow,
      snap.run,
      snap.delta,
      snap.action,
      snap.result,
      snap.reason,
      // snap.secs,
      TraderLib.calcPoints(snap.take),
      snap.msg
    ]
    let line = fields.join('\t')
    this.logs.textLog.write(line)
    // let line = `${ snap.priceDiff }\t${snap.dir} ${snap.dirArrow}\t${snap.swing}\t${snap.run}\t${snap.tx.action} \t${snap.msg}`
    console.log(line)
    this.logs.textLog.write(line)
    if (snap.timeDiff > 100) {
      // dont write jitter or first run
      this.stringifier.write(snap)
    }
  }

  logTx(tx: ITX) {
    console.log('TX', tx)
    TxLog.write(tx)
  }

}

export default BotLog