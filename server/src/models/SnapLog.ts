import Logger from '../lib/Logger'
const logger = new Logger('SnapLog')
import BaseModel from "./BaseModel"

import {
  ISnap,
  ITX
} from "../types/types"


let coll: any

class SnapLog {

  public static async init() {
    if (coll) return coll
    coll = await BaseModel.init('SnapLog')
  }

  public static async removeAll() {
    await SnapLog.init()
    await coll.removeMany({})
  }

  public static async write(snap: ISnap) {
    await SnapLog.init()
    coll.insert(snap)
  }

}

export default SnapLog
