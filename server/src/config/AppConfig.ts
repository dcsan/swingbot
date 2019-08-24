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


const AppConfig = {
  BinApiKey: process.env.BinApiKey,
  BinApiSecret: process.env.BinApiSecret,
  appName: appName,
  dbName: appName,
  mongoUri: mongoUri,
  testing
}

// logger.log('set AppConfig', AppConfig)

export default AppConfig
