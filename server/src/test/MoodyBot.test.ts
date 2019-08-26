import Logger from '../lib/Logger'
const logger = new Logger('MoodyBot.test')

import DbConn from "../lib/DbConn"
import { MoodyBot } from "../bots/MoodyBot"
import DataSource from '../lib/DataSource'

import {
  IPrice,
  IBotConfig,
  IKalkConfig
} from "../types/types"

const priceList = [
  10000,
  10000,
  10000,
  10000,
  10000,  // warm up
  10010,
  10021,  // buy
  10030,
  10040,
  10050,
  10060,
  10040,
  10030,  // sell
  10025,
  10020,
  10025,
  10030,  // buy
  10040,
  10080,
  10070,
  10065,  //
  10060,
  10055,
  10080,
  10090,
  10080,
  10071,
  10060,
  10020,
  10000,
]

const calcConfig: IKalkConfig = {
  stepUp: 5,
  stepDown: -5
}

// import {
//   Kalk,
//   IKalk
// } from '../lib/Kalk'

// shared bot instance
// lets hope parallel tests dont break it
let bot: MoodyBot

describe('moody bot', () => {

  beforeAll(async () => {
    const botConfig: IBotConfig = {
      logfile: 'moodytest.log.csv',
      calcConfig: calcConfig
    }
    // logger.log('create bot with => ', botConfig)
    bot = new MoodyBot(botConfig)
    await bot.init()
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
    logger.log('report', bot.makeReport() )
    expect(bot.state.tradeCount).toEqual(6)  // not very good
    expect(bot.state.runProfit).toEqual(25)  // not very good
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
    expect(bot.state.runProfit).toBeDefined()  // not very good
    console.log('random.total', bot.state.runProfit)
  })

  afterAll(async() => {
    await DbConn.close() // for jest
  })

})