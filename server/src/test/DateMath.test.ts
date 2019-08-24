describe('moody bot', () => {

  // based on the price data above
  test('simpleTrader', () => {
    let d = new Date('2019-08-21')
    d.setHours(3)
    expect(d.getHours()).toBe(3)
  })

})
