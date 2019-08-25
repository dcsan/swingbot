import { priceData } from './testData'

import {
  Kalk,
  IKalk
} from '../lib/Kalk'

let calco: Kalk

describe('calculate swings', () => {

  beforeAll(() => {
    calco = new Kalk({
      stepUp: 1,
      stepDown: 2
    })
  })

  test('swingUp.chart', () => {
    let miniChart = calco.miniChart(priceData.swingUp)
    expect(miniChart).toBe('-DDUU');
  })

  test('swingDown.chart', () => {
    let miniChart = calco.miniChart(priceData.swingDown)
    expect(miniChart).toBe('U-DD');
  })

  test('oneDown', () => {
    let miniChart = calco.miniChart(priceData.oneDown)
    expect(miniChart).toBe('DD');
  })

  test('seeSaw', () => {
    let miniChart = calco.miniChart(priceData.seeSaw)
    expect(miniChart).toBe('UDU--DUDUD');
  })

  test('swingUp.calc', () => {
    let calc: IKalk = calco.calcAll(priceData.swingUp)
    expect(calc.dir).toBe('U');
    // expect(calc.swing).toBe('S-U');
  })

  test('swingDown.calc', () => {
    let calc: IKalk = calco.calcAll(priceData.swingDown)
    expect(calc.dir).toBe('D');
    expect(calc.miniChart).toBe('U-DD');
    // expect(calc.swing).toBe('S-D');
    expect(calc.swing).toBe('R-D');
  })

  test('runDown.calc', () => {
    let calc: IKalk = calco.calcAll(priceData.runDown)
    expect(calc.dir).toBe('D');
    expect(calc.miniChart).toBe('-DUDDDD');
    expect(calc.swing).toBe('R-D');
  })

})

