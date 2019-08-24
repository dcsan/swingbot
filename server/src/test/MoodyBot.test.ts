import {MoodyBot} from "../bots/MoodyBot"
import DataSource from '../lib/DataSource'

import {
  IPrice
} from "../types/types"

const priceList = [
  10000,
  10000,
  10000,
  10000,
  10000,
  10010,
  10020,
  10030,
  10040,
  10050,
  10060,
  10040,
  10020,
  10030,
  10040,
  10050,
  10060,
  10070,
  10080,
  10100,
]

// import {
//   Kalk,
//   IKalk
// } from '../lib/Kalk'

describe('moody bot', () => {

  // based on the price data above
  xtest('simpleTrader', () => {
    let bot = new MoodyBot()
    priceList.forEach(p => {
      const ip: IPrice = {
        open: p
      }
      bot.tick(ip)
      // console.log(state.calc.action)
      // console.log(state.result)
    })
    expect(bot.state.total).toEqual(-10)  // not very good
  })

  // based on random data
  xtest('randomTrader', () => {
    let bot = new MoodyBot()
    let priceList = DataSource.generate(200)
    priceList.forEach(p => {
      const ip = {
        open: p
      }
      bot.tick(ip)
    })
    expect(bot.state.total).toBeDefined()  // not very good
    console.log('random.total', bot.state.total)
  })

})