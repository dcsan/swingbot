import {
  testData
} from './testData'

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


describe('calculate directions', () => {

  beforeAll(() => {
    calco = new Kalk({
      stepUp: 10,
      stepDown: -10
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
    let dir = calco.calcDir(5, 15)
    expect(dir).toBe('U')
  })

  test('dir.jump.up', () => {
    let dir = calco.calcDir(5, 50)
    expect(dir).toBe('J')
  })

  test('dir.crash.down', () => {
    let dir = calco.calcDir(50, 5)
    expect(dir).toBe('K')
  })

})

describe('calculate swings', () => {

  beforeAll(() => {
    calco = new Kalk({
      stepUp: 10,
      stepDown: -10
    })
  })
  test('swingUp.chart', () => {
    let miniChart = calco.miniChart(testData.swingUp)
    // console.log(testData.swingUp)
    expect(miniChart).toBe('FDKJJ');
  })

  test('swingDown', () => {
    let res = calco.calcAll([100, 120, 130, 120, 100])
    expect(res.miniChart).toBe('UudD');
    expect(res.swing).toBe('S-D')
    expect(res.action).toBe('SELL')
  })

  test('down.Krash', () => {
    let res = calco.calcAll([100, 120, 100, 110, 80])
    expect(res.miniChart).toBe('UDuK');
    expect(res.swing).toBe('K-D')
    expect(res.action).toBe('SELL')
  })

  test('oneDown', () => {
    let miniChart = calco.miniChart([100,80, 60])
    expect(miniChart).toBe('DD');
  })

  test('seeSaw', () => {
    let miniChart = calco.miniChart(testData.seeSaw)
    expect(miniChart).toBe('FFUFFKFdJF');
  })

  test('swingUp.calc', () => {
    let calc: IKalk = calco.calcAll(testData.swingUp)
    expect(calc.dir).toBe('J');
    // expect(calc.swing).toBe('S-U');
  })

  test('swingDown.calc', () => {
    let calc: IKalk = calco.calcAll([120, 130, 140, 130, 110])
    expect(calc.dir).toBe('D');
    expect(calc.miniChart).toBe('uudD');
    expect(calc.swing).toBe('S-D');
    // expect(calc.swing).toBe('R-D');
  })

  test('runDown.calc', () => {
    let prices = [100, 200, 180, 160, 140, 120 ]
    let calc: IKalk = calco.calcAll(prices)
    expect(calc.dir).toBe('D');
    expect(calc.miniChart).toBe('JDDDD');
    expect(calc.swing).toBe('R-D');
  })

})

