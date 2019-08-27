const RikMath = {
  pct(flt: number): number {
    return RikMath.fixed(flt*100)
  },

  // because JS .toFixed() returns a string DOH
  // round a number to XX decimal places
  fixed(val: number, places: number = 2): number {
    let mul = Math.pow(10, places) // eg 2 = 100
    let round = Math.round(val * mul);
    return (round / mul)
  }

}

export default RikMath