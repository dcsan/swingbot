import DbConn from '../lib/DbConn'
import Logger from '../lib/Logger'
const logger = new Logger('BaseModel')

class BaseModel {

  public static async init() {
    let coll = await DbConn.getColl('Logger')
    logger.info('init DONE')
    return coll
  }

}

export default BaseModel
