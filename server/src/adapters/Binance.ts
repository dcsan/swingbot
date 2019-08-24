const Binance = require('binance-api-node').default
import AppConfig from "../config/AppConfig"


// Authenticated client, can make signed calls
const binClient = Binance({
  apiKey: AppConfig.BinApiKey,
  apiSecret: AppConfig.BinApiSecret
  // getTime: xxx // time generator function, optional, defaults to () => Date.now()
})

export default binClient

