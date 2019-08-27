import Logger from '../lib/Logger'
const logger = new Logger('MoodyBot.test')

import DbConn from "../lib/DbConn"
import { MoodyBot } from "../bots/MoodyBot"
import DataSource from '../lib/DataSource'

import { testData } from './testData'

import {
  IPrice,
  IBotConfig,
  IKalkConfig
} from "../types/types"


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
    testData.priceRun.forEach(p => {
      const ip: IPrice = {
        open: p
      }
      bot.tick(ip)
      // console.log(state.calc.action)
      // console.log(state.result)
    })
    logger.info('report', bot.makeReport() )
    expect(bot.state.tradeCount).toEqual(6)  // not very good
    expect(bot.state.runProfit).toEqual(34)  // not very good
  })

  // based on random data
  xtest('randomTrader', () => {
    let priceRun = DataSource.generate(200)
    priceRun.forEach(p => {
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