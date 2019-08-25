import AppConfig from "../config/AppConfig"   // setup env
import DbConn from '../lib/DbConn'
import Logger from '../lib/Logger'
const logger = new Logger('BaseModel')

class BaseModel {

  public static async init(collName: string) {
    logger.log('BaseModel.init.start')
    await DbConn.init()
    let coll = await DbConn.getColl(collName)
    logger.info('BaseModel.init.end', collName)
    return coll
  }

}

export default BaseModel
