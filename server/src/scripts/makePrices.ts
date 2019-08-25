import PriceModel from '../models/PriceModel'

async function main() {
  await PriceModel.loadBinanceData()
}

main()
