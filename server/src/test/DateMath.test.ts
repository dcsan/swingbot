import moment = require('moment')

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

})
