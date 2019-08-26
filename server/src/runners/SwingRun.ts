import Logger from '../lib/Logger'
const logger = new Logger('SwingRun')
import DbConn from '../lib/DbConn'
import TxLog from '../models/TxLog'

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

const config: IBotConfig = {
  logfile: 'swinger.log.csv',
  calcConfig: {
    stepDown: 5,
    stepUp: 5
  }
}

const priceData = async(): Promise<IPrice[]> => {
  // let priceList :IPrice[] = await PriceModel.find({
  //   idx: { $gt: 15000 }
  // })

  let finder = {
    date: {
      $gte: new Date("2017-10-01T00:00:00.000Z"),
      $lte: new Date("2017-12-01T23:00:00.000Z"),
    }
  }
  let sorter = { date: 1 }
  let limit = 100
  return PriceModel.find(finder, sorter, limit)
}

const main = async () => {
  await PriceModel.init()
  await TxLog.init()
  await TxLog.removeAll()

  const bot = new MoodyBot(config)
  let priceList = await priceData()

  logger.report('priceList.length', priceList.length)
  // priceList = priceList.slice(0, 5)

  priceList.forEach( async(ip) => {
    await bot.tick(ip)
  })

  logger.report('market.start\t', priceList[0].open)
  logger.report('market.end\t', priceList[priceList.length - 1].open)
  logger.report('profit.total:\t', bot.state.total)
  logger.report('log:', config.logfile)
  DbConn.close()  // to exit
}

main()
