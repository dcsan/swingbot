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
  let sorter = {idx: 1} // forward in time
  let txList = await TxLog.find(finder, fields, sorter)
  // txList = txList.slice(700, 900)

  let openList = txList.map( (tx: IPrice) => tx.last1 )
  let volumeList = txList.map((tx: IPrice) => tx.btc_volume )
  let buyList = txList.map((tx: IPrice) => tx.buy )
  let sellList = txList.map((tx: IPrice) => tx.sell )
  let profits = txList.map((tx: IPrice) => tx.profit )
  let positions = txList.map((tx: IPrice) => tx.position ? tx.position : undefined )
  let deltas = txList.map((tx: IPrice) => tx.delta ? tx.delta : undefined )
  let tradePrices = txList.map((tx: IPrice) => tx.tradePrice ? tx.tradePrice : undefined )

  let open = {
    name: 'open',
    type: 'spline',
    data: openList,
    yAxis: 0
  }

  let buy = {
    name: 'buy',
    type: 'line',
    data: buyList,
    yAxis: 0,
    marker: {
      symbol: 'triangle',
      width: 5,
      lineColor: '#00FF00',
      fillColor: '#00FF00'  // green
    }
  }

  let sell = {
    name: 'sell',
    type: 'line',
    data: sellList,
    yAxis: 0,
    color: '#FF0000',
    marker: {
      enabled: true,
      symbol: 'triangle-down',
      width: 5,
      height: 5,
      lineWidth: 4,
      color: '#FF0000',
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

  let delta = {
    name: 'delta',
    type: 'line',
    data: deltas,
    yAxis: 3
  }

  let tradePrice = {
    name: 'tradePrice',
    type: 'line',
    data: tradePrices,
    yAxis: 0
  }

  let chartData: any[] = [
    open,
    buy,
    sell,
    profit,
    volume,
    position,
    // delta
    tradePrice
  ]

  let chartOptions = {
    tooltip: {
      shared: true
    },

    plotOptions: {
      line: {
        marker: {
          radius: 2,
          // lineColor: '#666666',
          // lineWidth: 1
        }
      }
    },

    chart: {
      zoomType: 'x'
    },
    yAxis: [
      { // y0
        labels: {
          format: '${value}',
          // style: {
          //     color: Highcharts.getOptions().colors[2]
          // }
        },
        title: {
          text: 'price',
        }
      },
      { // y1
        title: {
          text: 'profit'
        },
        opposite: true
      },
      { // y2
        title: {
          text: 'volume'
        },
        opposite: true
      },
      { // y3
        title: {
          text: 'tradePrice'
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