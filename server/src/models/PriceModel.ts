import Logger from '../lib/Logger'
const logger = new Logger('PriceData')
import BaseModel from "./BaseModel"
import DataSource from '../lib/DataSource'

let coll: any

import {
  IPrice
} from '../types/types'

class PriceModel {

  public static async init() {
    if (coll) return coll
    coll = await BaseModel.init('Price')
  }

  public static async removeAll() {
    await PriceModel.init()
    await coll.removeMany({})
  }

  public static getColl() {
    return coll
  }

  public static async log(row: any) {
    await PriceModel.init()
    coll.insert(row)
  }

  public static async reset(rows: any[]) {
    await PriceModel.init()
    await coll.removeMany({})
    await coll.insertMany(rows)
  }

  public static async find(finder: any): Promise<IPrice[]> {
    await PriceModel.init()
    let data: IPrice[] = await coll.find(finder).toArray()
    return data
  }


// read the Binance Data and load it into mongo
  public static async loadBinanceData() {
    let fileName = 'binance.1hr.raw.csv'
    let rows: any[] = await DataSource.formatBinanceData(fileName)
    console.log(rows[0])
    console.log(rows[1])
    const headers = [
      'idx',
      'Symbol',
      'avg',
      'Date',
      'Open',
      'High',
      'Low',
      'Close',
      'date',
      'time',
      'hour',
      'ampm',
      'ts',
    ]
    await DataSource.writeCsvData('binance.1hr.clean.csv', rows, headers)
    await PriceModel.reset(rows)
    // console.log('rows', rows)
  }

}

// export {
//   PriceData,
//   IPrice
// }

export default PriceModel
