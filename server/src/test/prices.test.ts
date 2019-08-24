import { priceData } from './testData'

import {
  Kalk,
  IKalk
} from '../lib/Kalk'


test('swingUp.chart', () => {
  let miniChart = Kalk.miniChart(priceData.swingUp)
  expect(miniChart).toBe('-DDUU');
})

test('swingDown.chart', () => {
  let miniChart = Kalk.miniChart(priceData.swingDown)
  expect(miniChart).toBe('U-DD');
})

test('oneDown', () => {
  let miniChart = Kalk.miniChart(priceData.oneDown)
  expect(miniChart).toBe('DD');
})

test('seeSaw', () => {
  let miniChart = Kalk.miniChart(priceData.seeSaw)
  expect(miniChart).toBe('UDUDUDUD');
})

test('swingUp.calc', () => {
  let calc: IKalk = Kalk.calcAll(priceData.swingUp)
  expect(calc.dir).toBe('U');
  expect(calc.swing).toBe('U');
})


test('swingDown.calc', () => {
  let calc: IKalk = Kalk.calcAll(priceData.swingDown)
  expect(calc.dir).toBe('D');
  expect(calc.miniChart).toBe('U-DD');
  expect(calc.swing).toBe('D');
})


