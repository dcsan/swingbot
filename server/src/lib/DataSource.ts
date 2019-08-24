var csvWriter = require('csv-write-stream') // writer
const csv = require('csv-parser') // reader
const fs = require('fs')

import Logger from '../lib/Logger'
const logger = new Logger('DataSource')

let lastPrice = 10000
const path = require('path')

import {
  IKalk,
  Kalk
} from './Kalk'

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
      let calc: IKalk = Kalk.calcAll(prices)
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
    const fp = DataSource.dataFilePath(fileName)
    let results: any[] = []
    let p = new Promise((resolve, reject) => {

      const makeFloat = (header: string, index: number, value: string) => {
        let float = parseFloat(value)
        if (isNaN(float)) {
          return value
        } else {
          return float
        }
        // switch (true) {
        //   case (/Date/.test(header)):
        //     return value
        //   // return new Date(value)
        //   case (/Symbol/.test(header)):
        //     return value
        //   default:
        //     return parseFloat(value)
        // }
      }

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
          // console.log('row', row)
          row.idx = idx++
          row.when = row.Date
          row.day = row.Date.split(' ')[0]
          row.time = row.Date.split(' ')[1]
          row.hour = row.time.split('-')[0]
          row.hour = parseInt(row.hour)
          row.ampm = row.time.split('-')[1]

          if (row.ampm === 'PM') {
            row.hour += 12
          }
          row.btc_volume = row['Volume BTC']
          row.usdt_volume = row['Volume USDT']
          row.date = new Date(row.day)
          row.date.setHours(row.hour)
          row.timestamp = row.date.getTime();
          row.avg = (row.Open + row.Close) / 2.0

          let keys = Object.keys(row)
          let out: any = {}
          keys = keys.filter(k => ! /Volume/.test(k))
          keys.map(k => {
            let val = row[k]
            k = k.toLowerCase()
            out[k] = val
          })

          // console.log('data', row)
          results.push(out)
        })
        .on('end', () => {
          // console.log(results);
          // FIXME - uses lots of memory, could be a writable stream instead
          // but that is harder to test async
          // results = results.reverse()
          logger.log('end format stream')
          resolve(results)
        })
        .on('readable', () => {
          logger.log('readable')
        })
        .on('close', () => {
          // console.log(results);
          // FIXME - uses lots of memory, could be a writable stream instead
          // but that is harder to test async
          // results = results.reverse()
          logger.log('close format stream')
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


  // async readCsvData(fileName?: string, maxLines: number = 250) {
  //   let count = 0
  //   fileName = fileName || 'Binance_BTCUSDT_1h.csv'
  //   const fp = RandomPricer.dataFilePath(fileName)
  //   const stream = fs.createReadStream(fp, { encoding: 'utf8' });
  //   const parser = parse()
  //   stream.pipe(parser)

  //   let p = new Promise((resolve, reject) => {
  //     parser.on('end', function () {
  //       console.log('ended')
  //       resolve(p)
  //     })
  //     parser.on('error', function (err: any) {
  //       console.error(err.message)
  //     })
  //     parser.on('readable', function () {
  //       let record
  //       while (record = parser.read()) {
  //         console.log('record', record)
  //         // output.push(record)
  //       }
  //     })
  //   })

  //   return (parser)

  // let p = new Promise((resolve, reject) => {
  //   stream.on('data', (data: any) => {
  //     count++
  //     console.log('data', count, maxLines)
  //     // if (count > maxLines) {
  //     //   stream.destroy();
  //     // }
  //   });
  //   stream.on('end', () => {
  //     console.log('stream end')
  //   })

  //   stream.on('close', () => {
  //     console.log('stream close')
  //     // console.log('stream end');
  //     // resolve(stream)
  //   });
  // })

  // return p

  // }

}

export default DataSource
