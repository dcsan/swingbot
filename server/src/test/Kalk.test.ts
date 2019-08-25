import { priceData } from './testData'

import {
  Kalk,
  IKalk
} from '../lib/Kalk'

let calco: Kalk

const testDirectionData = [
  [20, 10, 'D'],
  [5, 10, 'u' ],
  [5, 15, 'U' ],
  [10, 5, 'd'],
  [10, 0, 'D'],
  [10, 11, 'F'],
  [11, 10, 'F'],
  [13, 10, 'F'],
]


xdescribe('calculate directions', () => {

  beforeAll(() => {
    calco = new Kalk({
      stepUp: 5,
      stepDown: -5
    })
  })

  test('dir.flat', () => {
    let keys = Object.keys(testDirectionData)
    testDirectionData.forEach(row => {
      // @ts-ignore
      let [p1, p2, exp] = row
      // @ts-ignore
      let dir = calco.calcDir(p1, p2)
      if (dir !== exp) {
        console.error(p1, p2, `expect: ${ exp }`, `actual: ${ dir }`)
      }
      expect(dir).toBe(exp)
    })
  })

  test('dir.down', () => {
    let dir = calco.calcDir(10, 7)
    expect(dir).toBe('F')
  })
  test('dir.down.fast', () => {
    let dir = calco.calcDir(10, 5)
    expect(dir).toBe('d')
  })

  test('dir.up', () => {
    let dir = calco.calcDir(5, 11)
    expect(dir).toBe('u')
  })

  test('dir.up.fast', () => {
    let dir = calco.calcDir(5, 20)
    expect(dir).toBe('U')
  })

})

describe('calculate swings', () => {

  beforeAll(() => {
    calco = new Kalk({
      stepUp: 5,
      stepDown: -5
    })
  })
  test('swingUp.chart', () => {
    let miniChart = calco.miniChart(priceData.swingUp)
    console.log(priceData.swingUp)
    expect(miniChart).toBe('FDDUU');
  })

  test('swingDown.chart', () => {
    let miniChart = calco.miniChart(priceData.swingDown)
    expect(miniChart).toBe('UFDD');
  })

  test('oneDown', () => {
    let miniChart = calco.miniChart(priceData.oneDown)
    expect(miniChart).toBe('DD');
  })

  test('seeSaw', () => {
    let miniChart = calco.miniChart(priceData.seeSaw)
    expect(miniChart).toBe('udUFFDuDUd');
  })

  test('swingUp.calc', () => {
    let calc: IKalk = calco.calcAll(priceData.swingUp)
    expect(calc.dir).toBe('U');
    // expect(calc.swing).toBe('S-U');
  })

  test('swingDown.calc', () => {
    let calc: IKalk = calco.calcAll(priceData.swingDown)
    expect(calc.dir).toBe('D');
    expect(calc.miniChart).toBe('UFDD');
    expect(calc.swing).toBe('S-D');
    // expect(calc.swing).toBe('R-D');
  })

  test('runDown.calc', () => {
    let prices = [100, 200, 180, 160, 140, 120 ]
    let calc: IKalk = calco.calcAll(prices)
    expect(calc.dir).toBe('D');
    expect(calc.miniChart).toBe('UDDDD');
    expect(calc.swing).toBe('R-D');
  })

})

