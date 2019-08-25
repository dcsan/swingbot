import Logger from '../lib/Logger'
const logger = new Logger('SwingRun')

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
  logfile: 'swinger.log',
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
      $lte: new Date("2017-11-01T23:00:00.000Z"),
    }
  }
  let sorter = {date: 1}
  return PriceModel.find(finder, sorter)
}

const main = async () => {
  await PriceModel.init()
  const bot = new MoodyBot(config)
  let priceList = await priceData()

  logger.report('priceList.length', priceList.length)

  priceList.forEach( ip => {
    bot.tick(ip)
  })

  logger.report('market.start\t', priceList[0].open)
  logger.report('market.end\t', priceList[priceList.length - 1].open)
  logger.report('profit.total:\t', bot.state.total)

}

main()
