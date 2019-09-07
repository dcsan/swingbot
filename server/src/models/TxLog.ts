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
    coll.createIndex({tick: 1})
    return coll
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
    await coll.insertOne(tx)
  }

  public static check() {
    if (!coll) {
      // throw 'tried to write before DB ready'
      logger.error('no coll')
    }
  }

  public static async find(finder: any, fields: any, sorter: any) {
    let data = await coll.find(finder, fields).sort(sorter).toArray()
    return data
  }

  // log random data
  // non-blocking
  public static async log(tx: any) {
    // logger.log('log', tx)
    tx.stamp = Date.now()
    // TxLog.check()
    await coll.insertOne(tx)
  }

}

export default TxLog
