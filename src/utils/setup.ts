import * as Lightning from '../grpc/lightning'
import { sequelize, models, Contact } from '../models'
import { exec } from 'child_process'
import * as QRCode from 'qrcode'
import { checkTag, checkCommitHash } from '../utils/gitinfo'
import * as fs from 'fs'
import * as rsa from '../crypto/rsa'
import { isClean } from './nodeinfo'
import { getQR } from './connect'
import { loadConfig } from './config'
import migrate from './migrate'
import { isProxy } from '../utils/proxy'
import { logging, sphinxLogger } from '../utils/logger'

const USER_VERSION = 7
const config = loadConfig()

export async function setupDatabase(): Promise<void> {
  sphinxLogger.info(['=> [db] starting setup'], logging.DB)
  await setVersion()
  sphinxLogger.info(['=> [db] sync now'], logging.DB)
  try {
    await sequelize.sync()
    sphinxLogger.info(['=> [db] done syncing'], logging.DB)
  } catch (e) {
    sphinxLogger.info(['[db] sync failed', e], logging.DB)
  }
  await migrate()
  sphinxLogger.info(['=> [db] setup done'], logging.DB)
}

async function setVersion() {
  try {
    await sequelize.query(`PRAGMA user_version = ${USER_VERSION}`)
  } catch (e) {
    sphinxLogger.error('=> [db] setVersion failed')
  }
}

export async function setupOwnerContact(): Promise<void> {
  let owner: Contact = await models.Contact.findOne({
    where: { isOwner: true, id: 1 },
  })
  if (!owner) {
    try {
      const info = await Lightning.getInfo()
      const one = await models.Contact.findOne({
        where: { isOwner: true, id: 1 },
      })
      if (!one) {
        let authToken: string | null = null
        let tenant: number | null = null
        // dont allow "signup" on root contact of proxy node
        if (isProxy()) {
          authToken = '_'
        } else {
          tenant = 1 // add tenant here
        }
        const contact = await models.Contact.create({
          id: 1,
          publicKey: info.identity_pubkey,
          isOwner: true,
          authToken,
          tenant,
        })
        sphinxLogger.info(['[db] created node owner contact, id:', contact.id])
      }
    } catch (err) {
      sphinxLogger.info([
        '[db] error creating node owner due to lnd failure',
        err,
      ])
    }
  }
}

export async function runMigrations(): Promise<void> {
  await new Promise((resolve, reject) => {
    const migration = exec(
      'node_modules/.bin/sequelize db:migrate',
      { env: process.env },
      err => {
        if (err) {
          reject(err)
        } else {
          resolve(true)
        }
      }
    )

    // Forward stdout+stderr to this process
    if (migration.stdout) migration.stdout.pipe(process.stdout)
    if (migration.stderr) migration.stderr.pipe(process.stderr)
  })
}

export async function setupTransportToken(): Promise<void> {
  const transportTokenKeys = await rsa.genKeys()
  fs.writeFileSync(
    config.transportPrivateKeyLocation,
    transportTokenKeys.private
  )
  fs.writeFileSync(config.transportPublicKeyLocation, transportTokenKeys.public)
}

export async function setupDone(): Promise<void> {
  await printGitInfo()
  await printQR()
}

async function printGitInfo(): Promise<void> {
  const commitHash = await checkCommitHash()
  const tag = await checkTag()
  sphinxLogger.info(`=> Relay version: ${tag}, commit: ${commitHash}`)
}

async function printQR(): Promise<void> {
  const b64 = await getQR()
  if (!b64) {
    sphinxLogger.info('=> no public IP provided')
    return
  }

  sphinxLogger.info(['>>', b64])
  connectionStringFile(b64)

  const clean = await isClean()
  if (!clean) return // skip it if already setup!

  sphinxLogger.info('Scan this QR in Sphinx app:')
  QRCode.toString(b64, { type: 'terminal' }, (err, url) => {
    sphinxLogger.info(url)
  })
}

function connectionStringFile(str: string): void {
  let connectStringPath = 'connection_string.txt'
  if ('connection_string_path' in config) {
    connectStringPath = config.connection_string_path
  }
  fs.writeFile(
    connectStringPath || 'connection_string.txt',
    str,
    function (err) {
      if (err) sphinxLogger.error(['ERROR SAVING connection_string.txt.', err])
    }
  )
}
