import Logger from '../lib/Logger'
const logger = new Logger('SwingRun')
import DbConn from '../lib/DbConn'
import TxLog from '../models/TxLog'
import RikMath from '../lib/RikMath'
// supplies Binance historical data
// can init using scripts/get-binance-data.sh
import PriceModel from '../models/PriceModel'

import {
  IPrice
} from "../types/types"

import {
  MoodyBot,
  IBotConfig
} from '../bots/MoodyBot'

const botConfig: IBotConfig = {
  logfile: 'swinger.log.csv',
  calcConfig: {
    stepUp: 20,
    stepDown: -5,
  },
  tradeCount: 500
}

const runConfig = {
  botConfig,
  finder: {
    date: {
      $gte: new Date("2017-10-01T00:00:00.000Z"),
      $lte: new Date("2018-12-01T23:00:00.000Z"),
    }
  }

}

const binPriceData = async(): Promise<IPrice[]> => {
  // let priceList :IPrice[] = await PriceModel.find({
  //   idx: { $gt: 15000 }
  // })

  let sorter = { date: 1 }
  let limit = runConfig.botConfig.tradeCount
  return PriceModel.find(runConfig.finder, sorter, limit)
}

const main = async () => {
  await PriceModel.init()
  await TxLog.init()
  await TxLog.removeAll()

  const bot = new MoodyBot(runConfig.botConfig)
  let priceList = await binPriceData()

  logger.report('priceList.length', priceList.length)
  // priceList = priceList.slice(0, 5)

  priceList.forEach( async(ip) => {
    await bot.tick(ip)
  })

  logger.report('log:', bot.makeReport() )
  DbConn.close()  // to exit
}

main()
