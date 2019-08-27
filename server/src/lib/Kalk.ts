import RikMath from '../lib/RikMath'
import Logger from '../lib/Logger'
const logger = new Logger('Kalk')

import {
  IKalkConfig,
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

const defaultConfig: IKalkConfig = {
  stepUp: 5,
  stepDown: -5
}


const DEFAULT_STEP = 10  // needed to trigger change

class Kalk {
  config: IKalkConfig

  constructor(config?: IKalkConfig) {
    // logger.log('config=>', config)
    if (!config) {
      logger.warn('no config got:', config)
      this.config = defaultConfig
    } else {
      this.config = config
    }
    if (this.config.stepDown >= 0) {
      logger.error('got a POSITIVE stepDown. that should be negative!')
    }
  }

  public calcDir(lastPrice: number, price: number) {

    // make sure smaller value tests are first
    let diff = price - lastPrice
    let cfg = this.config
    // console.log(lastPrice, price, 'diff:', diff, cfg)
    if (diff <= (3 * cfg.stepDown)) return 'K'  // krash
    if (diff >= (3 * cfg.stepUp)) return 'J'  // jump
    if (diff >= (2 * cfg.stepUp)) return 'U'
    if (diff <= (2 * cfg.stepDown)) return 'D'
    if (diff >= cfg.stepUp) return 'u'
    if (diff <= cfg.stepDown ) return 'd'
    return 'F'
  }

  public miniChart( history: number[] ): string {
    let lastPrice: number
    let chart = history.map(price => {
      let dir
      if (!lastPrice) { // first loop
        dir = '.'
      } else {
        dir = this.calcDir(lastPrice, price)
      }
      lastPrice = price
      return dir
    })
    chart.shift() // the first elem is always pointless as it compares with zero
    // console.log('history', history, chart)
    return chart.join('')
  }

  public calcSwing(miniChart: string): string {
    let sw = '-'
    if (/DDuU$/i.test(miniChart)) sw = 'S-U' // swing up
    if (/UU$/i.test(miniChart)) sw = 'R-U' // run up
    if (/uuu$/.test(miniChart)) sw = 'R-U' // run up
    if (/UUDD$/.test(miniChart)) sw = 'S-D'
    if (/uudd$/i.test(miniChart)) sw = 'S-D'  // catch all swings
    if (/u.dd$/i.test(miniChart)) sw = 'S-D'  // catch any going down . char
    if (/UFDD$/.test(miniChart)) sw = 'S-D'
    if (/U-D$/.test(miniChart)) sw = 'S-D'
    if (/DDD$/i.test(miniChart)) sw = 'R-D'
    if (/K$/i.test(miniChart)) sw = 'K-D' // krash down (stop-loss!)
    if (/J$/i.test(miniChart)) sw = 'J-U' // jump up (grab it!)
    // if (/DDD$/.test(miniChart)) sw = 'R-D'
    // if (/DDDD$/.test(miniChart)) sw = 'R-D'
    return sw
  }

  public calcAction(swing: string) {
    if (/-U$/.test(swing)) return 'BUY'
    if (/-D$/.test(swing)) return 'SELL'
    return '-'
  }

  public calcAll(history: number[]): IKalk {
    let miniChart = this.miniChart(history)
    const last1 = RikMath.fixed(history[history.length - 1])
    const last2 = RikMath.fixed(history[history.length - 2])
    const diff1 = RikMath.fixed(last1 - last2)
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
