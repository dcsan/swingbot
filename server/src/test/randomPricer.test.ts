/**
 * tests mainly for generating random data
 * now use sripts/makePrices
*/

import DataSource from '../lib/DataSource'
import {
  IKalk,
  Kalk
} from "../lib/Kalk"

const calco = new Kalk()

const BINANCE_DATA = 'Binance_BTCUSDT_1h.csv'
const STACK_SIZE = 5

xdescribe('price generation', () => {

  // slow test
  test('random prices', () => {
    for (let x = 0; x < 1000; x++) {
      let p = DataSource.randRange(1, -1)
      expect(p).toBeGreaterThan(-10)
      expect(p).toBeLessThan(10)
      console.log(p)
    }
  })

  test('price run', () => {
    let prices: number[] = []
    for (let x = 0; x < 1000; x++) {
      let p = DataSource.get()
      prices.push(p)
      prices = prices.slice(-STACK_SIZE)
      let k = calco.calcAll(prices)
      console.log(
        k.last1,
        k.diff1,
        k.dir,
        k.miniChart)
    }
  })

  test('generate', () => {
    let prices = DataSource.generate(100)
    expect(prices.length).toBe(100)
  })


  test('writeFile', async() => {
    await DataSource.writeRandomDataFile('prices.csv')
  })

  // based on binance data
  xtest('parseBinanceData', async (done) => {
    await DataSource.formatBinanceData(BINANCE_DATA, 50)
    done()
  })

  xtest('extractBinanceData', async (done) => {
    await DataSource.extractData(BINANCE_DATA, 'BinancePrices.csv')
    done()
  })

})