// do this as early as possible in app setup
import * as dotenv from "dotenv"
const path = require('path')

// avoid circular deps
const logger = console

// logger.log('load AppConfig')

let appName = process.env.APP_NAME
if (!appName) {
  appName = 'SwingBot'
  console.warn(`env. APP_NAME not set. using ${appName}`)
}

const envPath = path.join(__dirname, `${ appName }.env`)
dotenv.config({ path: envPath })
logger.info('using envPath', envPath)

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
  dbName: appName,
  mongoUri: mongoUri,
  appName,
  logMode,
  testing,
  port: process.env.port || 6060,
  init() {
    console.log('AppConfig,appName', appName)
    console.log('AppConfig,logMode', logMode)
    console.log('AppConfig,init.done')
  }
}

// logger.log('set AppConfig', AppConfig)

export default AppConfig
