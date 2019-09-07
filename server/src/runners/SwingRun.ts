import Logger from '../lib/Logger'
const logger = new Logger('SwingRun')
import DbConn from '../lib/DbConn'
import TxLog from '../models/TxLog'
// import RikMath from '../lib/RikMath'
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
  tradeCount: 1000
}

const runConfig = {
  botConfig,
  finder: {
    date: {
      $gte: new Date("2018-10-14T00:00:00.000Z"),
      $lte: new Date("2019-10-28T23:00:00.000Z"),
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

  logger.log('run start')
  for (let ip of priceList) {
    await bot.tick(ip)
  }
  // for await (let ip of priceList) {
  //   bot.tick(ip)
  // }
  // await priceList.forEach( async(ip) => {
  //   await bot.tick(ip)
  // })

  logger.log('run complete')

  logger.report('log:', bot.makeReport() )
  DbConn.close()  // to exit
}

main()
