
import PriceModel from "./PriceModel"
import TxLog from "./TxLog"

const Wrap = {
  async init() {
    await PriceModel.init()
    await TxLog.init()
  }
}

export default Wrap
