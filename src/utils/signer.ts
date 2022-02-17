import * as grpc from 'grpc'
import * as Lightning from '../grpc/lightning'
import * as ByteBuffer from 'bytebuffer'
import { loadConfig } from './config'

// var protoLoader = require('@grpc/proto-loader')
const config = loadConfig()
const LND_IP = config.lnd_ip || 'localhost'

// TODO like i did with walletkit
type SignerClient = any

let signerClient: SignerClient = null

export function loadSigner(): SignerClient {
  if (signerClient) {
    return signerClient
  } else {
    const credentials = Lightning.loadCredentials('signer.macaroon')
    const lnrpcDescriptor = grpc.load('proto/signer.proto')
    const signer: { Signer: SignerClient } = lnrpcDescriptor.signrpc as any
    signerClient = new signer.Signer(
      LND_IP + ':' + config.lnd_port,
      credentials
    )
    return signerClient
  }
}

export async function signMessage(msg: string): Promise<string> {
	const signer = await loadSigner()
  return new Promise((resolve, reject) => {
    try {
      const options = {
        msg: ByteBuffer.fromHex(msg),
        key_loc: { key_family: 6, key_index: 0 },
      }
      signer.signMessage(options, function(err, sig) {
        if (err || !sig.signature) {
          reject(err)
        } else {
          const buf = ByteBuffer.wrap(sig.signature)
          resolve(buf.toBase64())
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

export async function signBuffer(msg: Buffer): Promise<string> {
	const signer = await loadSigner()
  return new Promise((resolve, reject) => {
    try {
      const options = { msg }
      signer.signMessage(options, function (err, sig) {
        if (err || !sig.signature) {
          reject(err)
        } else {
          const buf = ByteBuffer.wrap(sig.signature)
          resolve(buf.toBase64())
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

async function verifyMessage(msg, sig, pubkey): Promise<{ [k: string]: any }> {
	const signer = await loadSigner()
  return new Promise((resolve, reject) => {
    if (msg.length === 0) {
      return reject('invalid msg')
    }
    if (sig.length !== 96) {
      return reject('invalid sig')
    }
    if (pubkey.length !== 66) {
      return reject('invalid pubkey')
    }
    try {
      const options = {
        msg: ByteBuffer.fromHex(msg),
        signature: ByteBuffer.fromBase64(sig),
        pubkey: ByteBuffer.fromHex(pubkey),
      }
      signer.verifyMessage(options, function (err, res) {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

export async function signAscii(ascii: string): Promise<string> {
  const sig = await signMessage(ascii_to_hexa(ascii))
  return sig
}

export async function verifyAscii(
  ascii: string,
  sig: Buffer,
  pubkey: string
): Promise<{ [k: string]: any }> {
  const r = await verifyMessage(ascii_to_hexa(ascii), sig, pubkey)
  return r
}

function ascii_to_hexa(str: string) {
  const arr1 = <string[]>[]
  for (let n = 0, l = str.length; n < l; n++) {
    const hex = Number(str.charCodeAt(n)).toString(16)
    arr1.push(hex)
  }
  return arr1.join('')
}
