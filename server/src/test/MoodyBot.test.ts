import MoodyBot from "../bots/MoodyBot"
import DataSource from '../lib/DataSource'

// import { priceData } from '../../data/prices.csv'

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

import {
  Kalk,
  IKalk
} from '../lib/Kalk'

// based on the price data above
xtest('simpleTrader', () => {
  let bot = new MoodyBot()
  priceList.forEach(p => {
    let state = bot.tick(p)
    console.log(state.calc.action)
    console.log(state.result)
  })
})

// based on random data
xtest('randomTrader', () => {
  let bot = new MoodyBot()
  let priceList = DataSource.generate(200)
  priceList.forEach(p => {
    let state = bot.tick(p)
    // console.log(state.calc.action)
    // console.log(state.result)
  })
  console.log('final.total', bot.state.total)
})

// based on binance data
xtest('parseBinanceData', async(done) => {
  let bot = new MoodyBot()
  let parser = await DataSource.pipeCsvData('Binance_BTCUSDT_1h.csv', 50)
  done()
})

test('extractBinanceData', async(done) => {
  let bot = new MoodyBot()
  // let parser = await DataSource.extractData('Binance_BTCUSDT_1h.csv')
  let parser = await DataSource.extractData('BinanceTest.csv')
  done()
})

