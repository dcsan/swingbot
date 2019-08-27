import moment = require('moment')
import RikMath from '../lib/RikMath'

describe('moody bot', () => {

  // based on the price data above
  test('simpleTrader', () => {
    let d = new Date('2019-08-21')
    d.setHours(3)
    expect(d.getHours()).toBe(3)
  })

  test('date format for gogle docs', () => {
    let dateObj = new Date('2019-01-26 18:30:59')
    let gdate: string = moment(dateObj).format('MM/D/YYYY HH:mm:ss')
    expect(gdate).toMatch('01/26/2019 18:30:59')
  })

  test('check fixed', () => {
    let num1 = RikMath.fixed(10.1234567, 1)
    let num2 = RikMath.fixed(10.1234567, 2)
    let num3 = RikMath.fixed(10.1234567, 3)
    // console.log(num1, num2, num3)
    expect(num1).toBeCloseTo(10.1)
    expect(num2).toBeCloseTo(10.12)
    expect(num3).toBeCloseTo(10.123)
  })

})
