import { Router } from "express"
import Logger from '../lib/Logger'
const logger = new Logger('chart.api')

const router = Router()

router.get("/ping", async (req, res) => {
  res.json({ msg: 'pong' })
})

router.get("/chart/data", async (req, res) => {
  logger.log('ping')
  res.json({ msg: 'ok' })
})

export default router