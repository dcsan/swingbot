import DbConn from "../lib/DbConn"
import { MoodyBot } from "../bots/MoodyBot"
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

// shared bot instance
// lets hope parallel tests dont break it
let bot: MoodyBot

describe('moody bot', () => {

  beforeAll(() => {
    bot = new MoodyBot({
      calcConfig: {
        stepUp: 1,
        stepDown: 2
      }
    })
  })

  // based on the price data above
  test('simpleTrader', () => {
    priceList.forEach(p => {
      const ip: IPrice = {
        open: p
      }
      bot.tick(ip)
      // console.log(state.calc.action)
      // console.log(state.result)
    })
    expect(bot.state.total).toEqual(0)  // not very good
  })

  // based on random data
  xtest('randomTrader', () => {
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

  afterAll(async() => {
    await DbConn.close() // for jest
  })

})