import AppConfig from '../config/AppConfig'
import { MoodyBot } from "../bots/MoodyBot"

import PriceData from '../models/PriceData'
import {
  IPrice
} from "../types/types"

let bot: any

describe('binance run', () => {

  beforeAll(async () => {
    // just do this once as its a long slow task
    // await PriceData.loadBinanceData()
    await PriceData.init()
    bot = new MoodyBot({
      logfile: 'trader.test.log.csv'
    })
    // console.log('done beforeAll')
  })

  // based on the price data above
  test('simpleTrader', async () => {
    await PriceData.init()
    let priceList :IPrice[] = await PriceData.find({
      idx: { $gt: 15000 }
    })
    console.log('pricelist.start', priceList[0].open)
    console.log('pricelist.end', priceList[priceList.length - 1].open)
    priceList.forEach( ip => {
      bot.tick(ip)
    })
    console.log('total', bot.state.total)
    // // expect(bot.state.total).toEqual(-10)  // not very good
    // console.log('end test')
    // done()
    // console.log('done')
  })

})