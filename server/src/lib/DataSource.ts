var csvWriter = require('csv-write-stream') // writer
const csv = require('csv-parser') // reader
const fs = require('fs')
const moment = require('moment')

import Logger from '../lib/Logger'
const logger = new Logger('DataSource')

let lastPrice = 10000
const path = require('path')

import {
  IKalk,
  Kalk
} from './Kalk'

const calco = new Kalk()

const DataSource = {

  randRange(min: number, max: number) {
    let range = min - max
    let val = Math.random() * range
    val = val - min
    return val
  },

  get(): number {
    lastPrice = lastPrice + DataSource.randRange(-10, 10)
    return lastPrice
  },

  generate(count: number) {
    let prices: number[] = []
    while (count-- > 0) {
      let p = DataSource.get()
      prices.push(p)
    }
    return prices
  },

  dataFilePath(fn: string) {
    const fp = path.join(__dirname, '../../data', fn)
    return fp
  },

  // write random data to a file
  writeRandomDataFile(fileName: string, count: number = 500) {
    const fp = DataSource.dataFilePath(fileName)
    let options = {
      headers: ['last1', 'last2', 'diff1', 'miniChart', 'dir', 'swing', 'action']
    }
    var writer = csvWriter(options)
    var stream = fs.createWriteStream(fp)
    writer.pipe(stream)
    let priceData = DataSource.generate(count)
    let prices: number[] = []
    priceData.forEach(p => {
      prices.push(p)
      prices = prices.slice(-5)
      let calc: IKalk = calco.calcAll(prices)
      // console.log(calc)
      writer.write(calc)
    })
    writer.end()
  },

  // write array to CSV file
  writeCsvData(fileName: string, data: any[], headers: string[]) {
    const fp = DataSource.dataFilePath(fileName)
    let options = {
      headers: headers
    }
    var writer = csvWriter(options)
    var stream = fs.createWriteStream(fp)
    writer.pipe(stream)
    data.forEach(row => {
      writer.write(row)
    })
  },

  // read binance data
  // rename some fields
  // format data info
  formatBinanceData(fileName: string, maxLines?: number): Promise<any[]> {
    logger.log('format', fileName)
    const makeFloat = (header: string, index: number, value: string) => {
      // let float = parseFloat(value)
      // if (isNaN(float)) {
      //   return value
      // } else {
      //   return float
      // }
      switch (true) {
        case (/Date/.test(header)):
          return value
        // return new Date(value)
        case (/Symbol/.test(header)):
          return value
        default:
          return parseFloat(value)
      }
    }

    const fp = DataSource.dataFilePath(fileName)
    let results: any[] = []
    let p = new Promise((resolve, reject) => {

      let options = {
        // mapValues: () => makeFloat
        // @ts-ignore
        mapValues: ({ header, index, value }) => makeFloat(header, index, value)
        // mapValues: makeFloat
      }

      let idx = 0
      fs.createReadStream(fp)
        .pipe(csv(options))
        .on('data', (row: any) => {
          // logger.log('raw.row', row)
          // logger.dot('.')
          row.idx = idx++

          // clean up the dates
          let dateInfo = row.Date // ugly date "2019-08-21 11-PM"
          let time12 = dateInfo.split(' ')[1] // 11-PM
          row.day = dateInfo.split(' ')[0]
          let hour = time12.split('-')[0]
          row.hour = parseInt(hour, 10)
          row.ampm = time12.split('-')[1] // PM
          if (row.ampm === 'PM') {
            row.hour += 12
          }
          let dateObj = new Date(row.day)
          dateObj.setHours(row.hour)
          row.timestamp = dateObj.getTime()
          // row.gdate = dateObj.toLocaleString() // for gdocs
          row.gdate = moment(dateObj).format('MM/D/YYYY HH:mm:ss')
          row.date = dateObj

          row.btc_volume = row['Volume BTC']
          row.usdt_volume = row['Volume USDT']
          row.avg = (row.Open + row.Close) / 2.0

          let keys = Object.keys(row)
          let out: any = {}
          keys = keys.filter(k => ! /Volume/.test(k))
          keys.map(k => {
            let val = row[k]
            k = k.toLowerCase()
            out[k] = val
          })

          // logger.log('row', row)
          results.push(out)
        })
        .on('end', () => {
          // console.log(results);
          // FIXME - uses lots of memory, could be a writable stream instead
          // but that is harder to test async
          // results = results.reverse()
          // logger.log('end format stream')
          resolve(results)
        })
        // .on('readable', () => {
        //   DONT call this or it wont be a pass-through stream
        //   logger.green('readable')
        // })
        .on('close', () => {
          // console.log(results);
          // FIXME - uses lots of memory, could be a writable stream instead
          // but that is harder to test async
          // results = results.reverse()
          // logger.green('close format stream')
          resolve(results)
        })

    })

    // @ts-ignore
    return p

  },

  async extractData(fn: string, outfn: string) {
    fn = fn || 'Binance_BTCUSDT_1h.csv'
    let data: any = await DataSource.formatBinanceData(fn)
    let outPath = DataSource.dataFilePath(outfn)
    var writer = fs.createWriteStream(outPath)

    data.forEach((item: any) => {
      let s = item.Open + ''
      writer.write(s + '\n')
    })

  }

}

export default DataSource
