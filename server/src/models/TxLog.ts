import Logger from '../lib/Logger'
const logger = new Logger('TxLog')
const BaseModel = require('./BaseModel')

let coll: any

class TxLog extends BaseModel {

  public static async init() {
    if (coll) return coll
    coll = super.init('TxLog')
  }

  public static coll() {
    if (!coll) {
      logger.error('tried to get coll before existed')
    } else {
      return coll
    }
  }

}

export default TxLog
