import { sphinxLogger } from './logger'
import { Response } from 'express'

export function success(res: Response, json: {} | string) {
  res.status(200)
  res.json({
    success: true,
    response: json,
  })
  res.end()
}

export function failure(res: Response, e: Error | string) {
  const errorMessage = typeof e === 'string' ? e : e.message
  sphinxLogger.error(`--> failure: ${errorMessage}`)
  res.status(400)
  res.json({
    success: false,
    error: errorMessage,
  })
  res.end()
}

export function failure200(res: Response, e: Error | string) {
  res.status(200)
  res.json({
    success: false,
    error: typeof e === 'string' ? e : e.message,
  })
  res.end()
}
