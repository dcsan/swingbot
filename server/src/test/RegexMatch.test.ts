describe('test regexes', () => {

  // based on the price data above
  test('matching updown', () => {
    let s = 'UFDD'
    expect(/U.DD$/.test(s)).toBeTruthy()
    expect(/U_DD$/.test(s)).toBeFalsy()
  })

})
