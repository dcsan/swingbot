import AppConfig from '../config/AppConfig'
import { MoodyBot } from "../bots/MoodyBot"
import DbConn from '../lib/DbConn'

import PriceModel from '../models/PriceModel'

import {
  IPrice
} from "../types/types"

let bot: any

describe('loading data', () => {

  beforeAll(async () => {
    jest.setTimeout(10000)
    await DbConn.init() // for jest
    await AppConfig.init()
    await PriceModel.init()
  })

  // based on the price data above
  test('clean binance data', async (done) => {
    let priceList = await PriceModel.cleanLoadBinanceDataFile()
    done()
  })

  afterAll(async() => {
    await DbConn.close() // for jest
  })

})