import express from "express";
import Logger from './lib/Logger'
const logger = new Logger('index')


import AppConfig from './config/AppConfig'
// console.log('starting')

const app: express.Application = express()

import chartApi from './api/chart.api'
app.use(chartApi)

app.get( "/", ( req, res ) => {
  res.send( "hello world" );
})

const main = async () => {
  let port = AppConfig.port
  logger.log('listening on port', port)
  app.listen({port})
}

main()

