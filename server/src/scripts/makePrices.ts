import Logger from "../lib/Logger"
const logger = new Logger('script')
import DbConn from '../lib/DbConn'
import PriceModel from '../models/PriceModel'

async function main() {
  logger.log('loading.start')
  await PriceModel.cleanLoadBinanceDataFile()
  logger.log('loading.done')
  await DbConn.close()
}

main()
