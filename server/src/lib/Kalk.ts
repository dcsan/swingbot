import {
  ISnap,
  IPrice
} from "../types/types"

interface IKalk {
  last1: number
  last2: number
  diff1: number
  miniChart: string
  swing: string
  dir: string
}

const Kalk = {

  miniChart( history: number[] ): string {
    let lastPrice: number
    let chart = history.map(price => {
      if (!lastPrice) {
        lastPrice = price
        return '.'
      }
      let dir = '-'
      if (price === lastPrice) { dir = '-' }
      if (price < lastPrice) { dir = 'D' }
      if (price > lastPrice) { dir = 'U' }
      lastPrice = price
      return dir
    })
    chart.shift() // the first elem is always pointless as it compares with zero
    return chart.join('')
  },

  swing(miniChart: string): string {
    let sw = '-'
    if (/DDUU$/.test(miniChart)) sw = 'U'
    if (/UUDD$/.test(miniChart)) sw = 'D'
    if (/DDD$/.test(miniChart)) sw = 'D'
    if (/-DD$/.test(miniChart)) sw = 'D'
    return sw
  },

  calcAll(history: number[]): IKalk {
    let miniChart = Kalk.miniChart(history)
    const last1 = history[history.length - 1]
    const last2 = history[history.length - 2]
    const diff1 = last1 - last2
    let result: IKalk = {
      last1,
      last2,
      diff1,
      miniChart,
      swing: Kalk.swing(miniChart),
      dir: miniChart[miniChart.length - 1]
    }
    return result
  }

}

export {
  Kalk, IKalk
}
