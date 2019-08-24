import DbConn from '../lib/DbConn'
import Logger from '../lib/Logger'
const logger = new Logger('BaseModel')

class BaseModel {

  public static async init(collName: string) {
    let coll = await DbConn.getColl(collName)
    logger.info('init DONE')
    return coll
  }

}

export default BaseModel
