// do this as early as possible in app setup
import * as dotenv from "dotenv"

import Logger from "../lib/Logger"
const logger = new Logger("AppConfig")

let nodeEnv = process.env.NODE_ENV
if (!nodeEnv) {
  logger.warn('NODE_ENV not set. using "local"')
  nodeEnv = 'local'
}

const envPath = `config/${nodeEnv}.env`
dotenv.config({ path: envPath })
logger.info('using envPath', envPath)

const appName = process.env.appName
const mongoPath = process.env.mongoPath || ''
const mongoUri = mongoPath + appName

const AppConfig = {
  BinApiKey: process.env.BinApiKey,
  BinApiSecret: process.env.BinApiSecret,
  appName: appName,
  dbName: appName,
  mongoUri: mongoUri
}

logger.log('config', AppConfig)

export default AppConfig
