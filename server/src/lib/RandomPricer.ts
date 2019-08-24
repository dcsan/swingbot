let lastPrice = 10000

const RandomPricer = {

  randRange(min: number, max: number) {
    let range = min - max
    let val = Math.random() * range
    val = val - min
    return val
  },

  get(): number {
    lastPrice = lastPrice + RandomPricer.randRange(-10, 10)
    return lastPrice
  },

  generate(count: number) {
    let prices: number[] = []
    while (count-- > 0) {
      let p = RandomPricer.get()
      prices.push(p)
    }
    return prices
  }

}

export default RandomPricer
