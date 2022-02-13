import * as grpc from 'grpc'
import * as Lightning from '../grpc/lightning'
import { loadConfig } from './config'
import { WalletKit, WalletClient } from './walletkit'

const config = loadConfig()
const LND_IP = config.lnd_ip || 'localhost'

let walletClient: WalletClient

export function loadWalletKit(): WalletClient {
  if (walletClient) {
    return walletClient
  } else {
    const credentials = Lightning.loadCredentials()
    const lnrpcDescriptor = grpc.load('proto/walletkit.proto')
    const walletkit = lnrpcDescriptor.walletrpc as unknown as WalletKit
    walletClient = new walletkit.WalletKit(
      LND_IP + ':' + config.lnd_port,
      credentials
    )
    return walletClient
  }
}

export interface UTXO {
  address_type: number
  address: string
  amount_sat: number
  pk_script: string
  outpoint: string
  confirmations: number
}

export async function listUnspent(): Promise<UTXO[]> {
  return new Promise((resolve, reject) => {
    loadWalletKit().listUnspent({ min_confs: 0, max_confs: 10000 }, function(err, res) {
      if (err || !(res && res.utxos)) {
        reject(err)
      } else {
        resolve(res.utxos)
      }
    })
  })
}
