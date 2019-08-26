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

  let openList = txList.map( (tx: IPrice) => tx.last1 )
  let volumeList = txList.map((tx: IPrice) => tx.btc_volume )
  let buyList = txList.map((tx: IPrice) => tx.buy )
  let sellList = txList.map((tx: IPrice) => tx.sell )
  let profits = txList.map((tx: IPrice) => tx.profit )
  let positions = txList.map((tx: IPrice) => tx.position )

  let open = {
    name: 'open',
    type: 'spline',
    data: openList,
    yAxis: 0
  }

  let buy = {
    name: 'buy',
    type: 'column',
    data: buyList,
    yAxis: 0,
    marker: {
      lineWidth: 4,
      fillColor: '#00FF00'  // green
    }
  }

  let sell = {
    name: 'sell',
    type: 'column',
    data: sellList,
    yAxis: 0,
    marker: {
      lineWidth: 4,
      fillColor: '#FF0000'  // red
    }
  }

  let profit = {
    name: 'profit',
    type: 'line',
    data: profits,
    yAxis: 1
  }

  let volume = {
    name: 'volume',
    type: 'column',
    data: volumeList,
    yAxis: 2
  }

  let position = {
    name: 'position',
    type: 'line',
    data: positions,
    yAxis: 0
  }

  let chartData: any[] = [
    open,
    buy,
    sell,
    profit,
    volume,
    position
  ]

  let chartOptions = {
    tooltip: {
      shared: true
    },
    chart: {
      zoomType: 'x'
    },
    yAxis: [
      { // Primary yAxis
        labels: {
          format: '${value}',
          // style: {
          //     color: Highcharts.getOptions().colors[2]
          // }
        },
        title: {
          text: 'price',
        },
        opposite: true
      }, {
        // Secondary yAxis
        title: {
          text: 'profit'
        }
      }, {
        title: {
          text: 'volume'
        }
      }
    ],
    series: chartData
  }

  let botRun = {
    title: 'Test TradeRun'
  }
  let runData = { botRun, chartOptions }
  logger.log('data', runData)
  res.json(runData)

})

export default router