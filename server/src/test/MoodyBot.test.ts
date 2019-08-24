import MoodyBot from "../bots/MoodyBot"
import RandomPricer from '../lib/RandomPricer'

// import { priceData } from '../../data/prices.csv'

const priceList = [
  10000,
  10000,
  10000,
  10000,
  10000,
  10010,
  10020,
  10030,
  10040,
  10050,
  10060,
  10040,
  10020,
  10030,
  10040,
  10050,
  10060,
  10070,
  10080,
  10100,
]

import {
  Kalk,
  IKalk
} from '../lib/Kalk'

xtest('simpleTrader', () => {
  let bot = new MoodyBot()
  priceList.forEach(p => {
    let state = bot.tick(p)
    console.log(state.calc.action)
    console.log(state.result)
  })
})


test('randomTrader', () => {
  let bot = new MoodyBot()
  let priceList = RandomPricer.generate(50000)
  priceList.forEach(p => {
    let state = bot.tick(p)
    // console.log(state.calc.action)
    // console.log(state.result)
  })
  console.log('final.total', bot.state.total)
})

