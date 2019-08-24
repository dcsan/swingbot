let lastPrice = 10000
const path = require('path')
const fs = require('fs')
var csvWriter = require('csv-write-stream')

import {
  IKalk,
  Kalk
} from '../lib/Kalk'

const RandomPricer = {

  randRange(min: number, max: number) {
    let range = min - max
    let val = Math.random() * range
    val = val - min
    return val
  },

  get(): number {
    lastPrice = lastPrice + RandomPricer.randRange(-10, 10)
    return lastPrice
  },

  generate(count: number) {
    let prices: number[] = []
    while (count-- > 0) {
      let p = RandomPricer.get()
      prices.push(p)
    }
    return prices
  },

  writeFile(fileName: string, count: number = 500) {
    const fp = path.join(__dirname, '../../data', fileName)
    let options = {
      headers: ['last1', 'last2', 'diff1', 'miniChart', 'dir', 'swing', 'action']
    }
    var writer = csvWriter(options)
    var stream = fs.createWriteStream(fp)
    writer.pipe(stream)
    let priceData = RandomPricer.generate(count)
    let prices: number[] = []
    priceData.forEach(p => {
      prices.push(p)
      prices = prices.slice(-5)
      let calc: IKalk = Kalk.calcAll(prices)
      // console.log(calc)
      writer.write(calc)
    })
    writer.end()
  }

}

export default RandomPricer
