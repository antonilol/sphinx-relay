import * as expressWinston from 'express-winston'
import * as winston from 'winston'
import * as moment from 'moment'
import { loadConfig } from './config'
import * as blgr from 'blgr' // doesn't exist on npm
import { Request } from 'express'

const config = loadConfig()

const blgrLogger = new blgr(config.logging_level)
const tsFormat = (ts) => moment(ts).format('YYYY-MM-DD HH:mm:ss').trim()

const logger = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf((info) => {
      return `-> ${tsFormat(info.timestamp)}: ${info.message}`
    })
  ),
  meta: false, // optional: control whether you want to log the meta data about the request (default to true)
  // msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req: Request) {
    if (req.path.startsWith('/json')) return true // debugger
    return false
  }, // optional: allows to skip some log messages based on request and/or response
})

export default logger

interface Logging {
  Express: string
  Lightning: string
  Meme: string
  Tribes: string
  Notification: string
  Network: string
  DB: string
  Proxy: string
  Lsat: string
  Greenlight: string
}

export const logging: Logging = {
  Express: 'EXPRESS',
  Lightning: 'LIGHTNING',
  Meme: 'MEME',
  Tribes: 'TRIBES',
  Notification: 'NOTIFICATION',
  Network: 'NETWORK',
  DB: 'DB',
  Proxy: 'PROXY',
  Lsat: 'LSAT',
  Greenlight: 'GREENLIGHT',
}

async function sphinxLoggerBase(
  message: any | Array<any>,
  loggingType = 'MISC',
  level: string
) {
  if (
    (config.logging && config.logging.includes(loggingType)) ||
    loggingType == 'MISC'
  ) {
    await blgrLogger.open()
    const [date, time] = new Date(Date.now()).toISOString().split('.')[0].split('T');
    const dateArr = date.split('-');
    dateArr.push(dateArr.shift()!.substring(2));
    blgrLogger[level](
      `${dateArr.join('-')}T${time}`,
      '[' + loggingType + ']',
      ...(Array.isArray(message) ? message : [message])
    )
  }
}

async function sphinxLoggerNone(
  message: any | Array<any>,
  loggingType?: string
): Promise<void> {
  await sphinxLoggerBase(message, loggingType, 'none')
}
async function sphinxLoggerError(
  message: any | Array<any>,
  loggingType?: string
): Promise<void> {
  await sphinxLoggerBase(message, loggingType, 'error')
}
async function sphinxLoggerWarning(
  message: any | Array<any>,
  loggingType?: string
): Promise<void> {
  await sphinxLoggerBase(message, loggingType, 'warning')
}
async function sphinxLoggerInfo(
  message: any | Array<any>,
  loggingType?: string
): Promise<void> {
  await sphinxLoggerBase(message, loggingType, 'info')
}
async function sphinxLoggerDebug(
  message: any | Array<any>,
  loggingType?: string
): Promise<void> {
  await sphinxLoggerBase(message, loggingType, 'debug')
}
async function sphinxLoggerSpam(
  message: any | Array<any>,
  loggingType?: string
): Promise<void> {
  await sphinxLoggerBase(message, loggingType, 'spam')
}

export const sphinxLogger = {
  none: sphinxLoggerNone,
  error: sphinxLoggerError,
  warning: sphinxLoggerWarning,
  info: sphinxLoggerInfo,
  debug: sphinxLoggerDebug,
  spam: sphinxLoggerSpam,
}
