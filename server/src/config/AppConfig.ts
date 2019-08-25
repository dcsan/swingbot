// do this as early as possible in app setup
import * as dotenv from "dotenv"
const path = require('path')

// avoid circular deps
const logger = console

// logger.log('load AppConfig')

let nodeEnv = process.env.NODE_ENV
if (!nodeEnv) {
  console.warn('NODE_ENV not set. using "local"')
  nodeEnv = 'local'
}

const envPath = path.join(__dirname, `${nodeEnv}.env`)
dotenv.config({ path: envPath })
// logger.info('using envPath', envPath)

const appName = process.env.appName
const mongoPath = process.env.mongoPath || ''
const mongoUri = mongoPath + appName

const testing = (
  process.env.NODE_ENV === 'test' ||
  process.env.TESTING === 'true'
)

const logMode = process.env.logMode || 'error|warn|green|fatal|report'

const AppConfig = {
  BinanceApiKey: process.env.BinanceApiKey,
  BinanceApiSecret: process.env.BinanceApiSecret,
  appName: appName,
  dbName: appName,
  mongoUri: mongoUri,
  nodeEnv,
  logMode,
  testing,
  port: process.env.port || 6060,
  init() {
    console.log('AppConfig,nodeEnv', nodeEnv)
    console.log('AppConfig,logMode', logMode)
    console.log('AppConfig,init.done')
  }
}

// logger.log('set AppConfig', AppConfig)

export default AppConfig
