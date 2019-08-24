import Logger from "./Logger"
const logger = new Logger("DbConn")
import { MongoClient, Db, Collection } from "mongodb"

import AppConfig from "../config/AppConfig"
const assert = require('assert')

// careful not to stamp on 'bot-env' DB names / collections

const dbName = AppConfig.dbName
if (!dbName) {
  logger.error('env', AppConfig)
  throw new Error('no dbName is set in process.env')
}

// let mongoClient: any = null
let dbHandle: any = null
// let dbConn: MongoClient = null

const DbConn = {
  // db: Db,

  async init () {
    if (dbHandle) {
      logger.log('return cached dbConn')
      return (dbHandle)
    }
    logger.info('connect mongoUri: ', AppConfig.mongoUri)
    return new Promise((resolve, reject) => {
      MongoClient.connect(AppConfig.mongoUri, { useNewUrlParser: true }, (err, db) => {
        if (err) {
          reject (err)
        }
        assert.equal(null, err)
        assert.ok(db != null)
        dbHandle = db.db(AppConfig.dbName)
        logger.log('got dbHandle')
        resolve(dbHandle)
      })
    })
  },

  async close() {
    // @ts-ignore
    await MongoClient.close()
  },

  // capitalize collection names
  getCollName: (name: string) => {
    name = name.replace(/-/g, '')
    return name[0].toUpperCase() + name.slice(1)
  },

  // collection names dont have puncs in
  getColl: async (name: string): Promise<Collection> => {
    if (!name) {
      logger.abort('getColl with no name!')
    }
    if (!dbHandle) {
      // logger.error('tried to getColl before dbHandle', name)
      dbHandle = await DbConn.init()
    }
    const collName: string = await DbConn.getCollName(name)
    logger.log('getColl', collName)
    const coll: Collection = dbHandle.collection(collName)
    return coll
  },

  enforceCapped: async (coll: { s: { name: any; }; }, size: number, max: number) => {
    if (!coll) {
      logger.error('ERROR enforceCapped no collection? ', coll)
      return
    }
    const name = coll.s.name
    logger.info('enforceCapped name: ', name)
    logger.info('size', size, 'max', max)
    if (!name) {
      logger.error('ERROR cant force capped for no collection and no name', coll)
      return
    }
    const data = await dbHandle.listCollections({ name }).toArray()
    let dbRes
    if (data.length) {
      dbRes = await dbHandle.command({
        convertToCapped: name,
        size,
        max
      })
      logger.info(`${name} converted to capped`)
    } else {
      dbRes = await dbHandle.createCollection(name, {
        capped: true,
        size,
        max
      })
      logger.info(`created capped ${name} collection`)
    }
    logger.info('dbRes', dbRes)
  },

  isCapped: async (coll: Collection) => {
    try {
      return await coll.isCapped()
    } catch (e) {
      return false
    }
  }
}

export default DbConn
