import TxLog from '../models/TxLog'

import { Router } from "express"
import Logger from '../lib/Logger'
const logger = new Logger('chart.api')
import {
  IPrice
} from '../types/types'

const router = Router()

router.get("/ping", async (req, res) => {
  res.json({ msg: 'pong' })
})


router.get("/tx/last", async (req, res) => {
  let finder = {}
  let fields = { open: 1 }
  let sorter = {idx: -1}
  let txList = await TxLog.find(finder, fields, sorter)
  // txList = txList.slice(700, 900)

  let openList = txList.map( (tx: IPrice) => tx.open )
  let volumeList = txList.map((tx: IPrice) => tx.btc_volume )
  let buyList = txList.map((tx: IPrice) => tx.in )
  let sellList = txList.map((tx: IPrice) => tx.out )
  let totalList = txList.map((tx: IPrice) => tx.total )

  let ser1 = {
    name: 'open',
    type: 'line',
    data: openList
  }

  let ser2 = {
    name: 'volume',
    type: 'column',
    data: volumeList
  }

  let ser3 = {
    name: 'buy',
    type: 'line',
    data: buyList
  }

  let ser4 = {
    name: 'sell',
    type: 'line',
    data: sellList
  }

  let ser5 = {
    name: 'total',
    type: 'line',
    data: totalList
  }

  const chartOptions: any = {
    title: {
      text: 'TxList'
    },
    series: [
      ser1,
      ser2,
      ser3,
      ser4,
      ser5
    ]
  }

  let botRun = {
    title: 'Test TradeRun'
  }
  let runData = { botRun, chartOptions }
  logger.log('data', runData)
  res.json(runData)

})

export default router