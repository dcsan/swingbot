import {
  ISnap,
  IPrice
} from "../types/types"

interface IKalk {
  last1: number
  last2: number
  diff1: number
  miniChart: string
  swing: string
  action: string
  dir: string
}

interface IKalkConfig {
  stepUp: number
  stepDown: number
}

const DEFAULT_STEP = 10  // needed to trigger change

class Kalk {
  config: IKalkConfig

  constructor(config: IKalkConfig) {
    this.config = config
  }

  public miniChart( history: number[] ): string {
    let lastPrice: number
    let chart = history.map(price => {
      if (!lastPrice) {
        lastPrice = price
        return '.'
      }
      let dir = '-'
      if (price === lastPrice) { dir = '-' }
      if (price < (lastPrice - this.config.stepUp)) { dir = 'D' }
      if (price > (lastPrice + this.config.stepDown)) { dir = 'U' }
      lastPrice = price
      return dir
    })
    chart.shift() // the first elem is always pointless as it compares with zero
    return chart.join('')
  }

  public calcSwing(miniChart: string): string {
    let sw = '-'
    if (/DDUU$/.test(miniChart)) sw = 'S-U' // swing up
    if (/UU$/.test(miniChart)) sw = 'R-U' // run up
    if (/UDD$/.test(miniChart)) sw = 'S-D'
    if (/DD$/.test(miniChart)) sw = 'R-D'
    // if (/DDD$/.test(miniChart)) sw = 'R-D'
    // if (/DDDD$/.test(miniChart)) sw = 'R-D'
    return sw
  }

  public calcAction(swing: string) {
    if (/-U$/.test(swing)) return 'BUY'
    if (/-D$/.test(swing)) return 'SELL'
    return 'HOLD'
  }

  public calcAll(history: number[]): IKalk {
    let miniChart = this.miniChart(history)
    const last1 = history[history.length - 1]
    const last2 = history[history.length - 2]
    const diff1 = last1 - last2
    const swing = this.calcSwing(miniChart)
    const action = this.calcAction(swing)
    let result: IKalk = {
      last1,
      last2,
      diff1,
      miniChart,
      swing,
      action,
      dir: miniChart[miniChart.length - 1]
    }
    return result
  }


}

export {
  Kalk, IKalk, IKalkConfig
}
