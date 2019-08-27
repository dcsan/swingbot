import chalk from "chalk"
import fs = require('fs')
import path = require('path')
import AppConfig from '../config/AppConfig'
// const AppConfig = require('../config/AppConfig')

// const fsPromises = fs.promises

// this should NOT depend on any other files in the app
// as most other files include the logger
// avoid circular deps!

// TODO
// allow pass params on import
// https://stackoverflow.com/questions/29923879/pass-options-to-es6-module-imports/43212897#43212897

const logPath = path.join(__dirname, "../../logs/app.log")

class Logger {

  public static splatArgs(args: any) {
    if (!args) { return }
    args = args.map( (arg: any) => {
      if (typeof arg === 'object') {
        // console.log('isObject', arg)
        arg = JSON.stringify(arg, null, 2)
      }
      return arg
    })
    return args
  }
  private where: string
  private whereMsg: string
  private silent: boolean

  constructor(where: string, silent: boolean = false) {
    this.silent = silent
    // @ts-ignore
    this.where = where.padStart(12, ' ')
    // this.where = `${where}]`
    this.where = chalk.inverse(`[${this.where}]`)
    this.whereMsg = this.where
  }

  public silence(flag: boolean) {
    this.silent = flag
  }

  public stringify(arg: any) {
    if (!arg) { return }
    if (typeof arg !== 'object') { return arg }
    // return arg.block ? arg.toString() :
    return JSON.stringify(arg, null, 2)
  }

  public inspectArgs (args: any[]) {
    return args.map(this.stringify).join(' ')
  }

  public output(wrap: any, args: any) {
    let text = this.inspectArgs(args)

    // suspend output during tests
    text = `${this.where}  |  ${text}`
    fs.appendFileSync(logPath, text + '\n')
    // if (AppConfig.testing || this.silent) {
      // skip log
      // console.log('testing', AppConfig.testing)
    // } else {
    console.log(wrap(text))
    // }
  }

  public warn(...args: any) {
    if (this.silent) { return }
    if (!/warn/.test(AppConfig.logMode)) { return }
    // console.log(chalk.yellow("\n--- WARNING ----"))
    this.output(chalk.yellow, args)
  }

  public error(...args: any) {
    if (!/error/.test(AppConfig.logMode)) { return }
    console.log(chalk.inverse.red("\n--- ERROR ----", args[0]))
    this.output(chalk.red, args)
    // console.log(chalk.red(this.whereFrom(), ...args))
    console.log(chalk.red("\n"))
    // TODO - send to loggly or other logging service
  }

  // no newline, just to show progress
  dot(s: string = '.') {
    process.stdout.write(s)
  }

  skipLog(mode: string) {
    process.stdout.write('-')
    // console.log('skipLog:', mode)
    // console.log('AppConfig.logMode:', AppConfig.logMode)
  }

  // fatal error
  public abort(...args: any) {
    args = Logger.splatArgs(args)
    this.error(args)
    throw( new Error('ABORT!'))
  }

  public fatal(msg: string, err: string) {
    this.error(msg, err)
    throw new Error(err)
  }

  public info(...args: any) {
    if (!/info/.test(AppConfig.logMode)) {
      // console.log("WTF")
      // this.skipLog('info')
      return
    }
    this.output(chalk.white, args)
  }

  public log(...args: any) {
    if (!/log/.test(AppConfig.logMode)) { return }
    this.output(chalk.grey, args)
  }

  public silly(...args: any) {
    if (!/silly/.test(AppConfig.logMode)) { return }
    this.output(chalk.grey, args)
  }

  public report(...args: any) {
    if (!/report/.test(AppConfig.logMode)) { return }
    this.output(chalk.white, args)
  }

  public green(...args: any) {
    if (!/green/.test(AppConfig.logMode)) { return }
    args = Logger.splatArgs(args)
    if (this.silent) {return}
    console.log(chalk.green(this.whereFrom(), ...args))
  }

  private whereFrom() {
    return `[${ this.where }]\t`
  }
}

export default Logger
