import TxLog from '../models/TxLog'

import { Router } from "express"
import Logger from '../lib/Logger'
const logger = new Logger('chart.api')

const router = Router()

router.get("/ping", async (req, res) => {
  res.json({ msg: 'pong' })
})

router.get("/tx/last", async (req, res) => {
  // let data = TxLog.coll().find(
  //   {}, {
  //     // fields

  //   }
  // )

  let data = {
    prices: [
      { idx: 1, open: 100 },
      { idx: 2, open: 120 },
      { idx: 3, open: 140 },
      { idx: 4, open: 150 },
    ]
  }

  res.json(data)
})

export default router