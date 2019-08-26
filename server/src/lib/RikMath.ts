const RikMath = {
  pct(flt: number): number {
    return RikMath.fixed(flt*100)
  },

  // because JS .toFixed() returns a string DOH
  fixed(val: number, places: number = 2): number {
    return Math.round( val * 10 ^ places ) / 10 ^ places;
  }

}

export default RikMath