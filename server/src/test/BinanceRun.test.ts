import DbConn from "../lib/DbConn"
import Logger from '../lib/Logger'
const logger = new Logger('BinanceRun.test')
import { MoodyBot } from "../bots/MoodyBot"

import PriceModel from '../models/PriceModel'

import {
  IPrice
} from "../types/types"

let bot: any

describe('binance run', () => {

  beforeAll(async () => {
    // just do this once on setup system as its a long slow task
    // await PriceData.loadBinanceData()

    await PriceModel.init()
    bot = new MoodyBot({
      logfile: 'trader.test.log.csv',
      calcConfig: {
        stepUp: 10,
        stepDown: 10
      }
    })
    // console.log('done beforeAll')
  })

  // based on Binance data already having been loaded into mongo test DB
  // this test will fail if data isn't loaded
  test('simpleTrader', async () => {
    await PriceModel.init()
    let priceList :IPrice[] = await PriceModel.find({
      idx: { $gt: 15000 }
    })
    // logger.log('pricelist.start', priceList[0].open)
    // logger.log('pricelist.end', priceList[priceList.length - 1].open)
    priceList.forEach( ip => {
      bot.tick(ip)
    })
    // console.log('total', bot.state.total)
    expect(bot.state.total).toEqual(-1757.38)  // varies with data
  })

  afterAll(async() => {
    await DbConn.close() // for jest
  })

})