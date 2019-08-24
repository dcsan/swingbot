import PriceData from '../models/PriceData'

async function main() {
  await PriceData.loadBinanceData()
}

main()
