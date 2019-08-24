const csv = require('csv-parser')
const fs = require('fs')

let lastPrice = 10000
const path = require('path')
var csvWriter = require('csv-write-stream')

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

  writeFile(fileName: string, count: number = 500) {
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

  pipeCsvData(fileName: string, maxLines: number = 50) {
    const fp = DataSource.dataFilePath(fileName)
    let results: any[] = []
    let p = new Promise((resolve, reject) => {

      const makeFloat = (header: string, index: number, value: string) => {
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

      let options = {
        // mapValues: () => makeFloat
        // @ts-ignore
        mapValues: ({ header, index, value}) => makeFloat(header, index, value)
        // mapValues: makeFloat
      }

      fs.createReadStream(fp)
      .pipe(csv(options))
      .on('data', (data: any) => results.push(data))
      .on('end', () => {
        // console.log(results);
        results = results.reverse()
        resolve(results)
      })
    })

    return p

  },

  async extractData(fn: string) {
    fn = fn || 'Binance_BTCUSDT_1h.csv'
    let data: any = await DataSource.pipeCsvData(fn)
    let outPath = DataSource.dataFilePath('output.csv')
    var writer = fs.createWriteStream(outPath)
    data.forEach((item: any) => {
      let s = item.Open + ''
      writer.write(s)
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
