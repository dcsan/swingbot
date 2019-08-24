import Logger from '../lib/Logger'
const logger = new Logger('TxLog')
import BaseModel from "./BaseModel"

import {
  ISnap,
  ITX,
  IPrice
} from "../types/types"


let coll: any

class TxLog {

  public static async init() {
    if (coll) return coll
    coll = await BaseModel.init('TxLog')
  }

  public static coll() {
    if (!coll) {
      logger.error('tried to get coll before existed')
    } else {
      return coll
    }
  }

  public static async removeAll() {
    await TxLog.init()
    await coll.removeMany({})
  }

  public static async write(tx: ITX) {
    tx.stamp = Date.now()
    await TxLog.init()
    await coll.insert(tx)
  }

}

export default TxLog
