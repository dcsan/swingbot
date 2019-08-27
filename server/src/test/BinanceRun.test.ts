import DbConn from "../lib/DbConn"
import Logger from '../lib/Logger'
const logger = new Logger('BinanceRun.test')
import { MoodyBot } from "../bots/MoodyBot"

import PriceModel from '../models/PriceModel'

import {
  IPrice
} from "../types/types"

let bot: MoodyBot

describe('binance run', () => {

  beforeAll(async () => {
    // just do this once on setup system as its a long slow task
    // await PriceData.loadBinanceData()
    jest.setTimeout(10000)
    await PriceModel.init()
    bot = new MoodyBot({
      logfile: 'trader.test.log.csv',
      calcConfig: {
        stepUp: 10,
        stepDown: -10
      }
    })
    await bot.init()
    // console.log('done beforeAll')
  })

  // based on Binance data already having been loaded into mongo test DB
  // this test will fail if data isn't loaded
  test('simpleTrader', async () => {
    await PriceModel.init()
    let priceList :IPrice[] = await PriceModel.find({
      // idx: { $gt: 15000 }
      date: {
        $gte: new Date("2018-10-01T00:00:00.000Z"),
        $lte: new Date("2018-10-30T00:00:00.000Z"),
      }
    })
    // logger.log('pricelist.start', priceList[0].open)
    // logger.log('pricelist.end', priceList[priceList.length - 1].open)
    for (let ip of priceList) {
      await bot.tick(ip)
    }
    // console.log('total', bot.state.total)
    console.log(bot.makeReport())
    // console.log('state', bot.state)
    expect(bot.state.tradeCount).toEqual(29)  // varies with data
    expect(Math.round(bot.state.runProfit)).toBeCloseTo(260)  // varies with data
  })

  afterAll(async() => {
    await DbConn.close() // for jest
  })

})