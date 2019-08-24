import DataSource from '../lib/DataSource'
import {
  IKalk,
  Kalk
} from "../lib/Kalk"

const STACK_SIZE = 5

// slow test
xtest('random prices', () => {
  for (let x = 0; x < 1000; x++) {
    let p = DataSource.randRange(1, -1)
    expect(p).toBeGreaterThan(-10)
    expect(p).toBeLessThan(10)
    console.log(p)
  }
})

xtest('price run', () => {
  let prices: number[] = []
  for (let x = 0; x < 1000; x++) {
    let p = DataSource.get()
    prices.push(p)
    prices = prices.slice(-STACK_SIZE)
    let k = Kalk.calcAll(prices)
    console.log(
      k.last1,
      k.diff1,
      k.dir,
      k.miniChart)
  }
})

test('generate', () => {
  let prices = DataSource.generate(100)
  expect(prices.length).toBe(100)
})


test('writeFile', () => {
  let prices = DataSource.writeFile('prices.csv')
})
