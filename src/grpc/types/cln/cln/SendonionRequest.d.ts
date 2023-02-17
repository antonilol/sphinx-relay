// Original file: proto/cln/node.proto

import type {
  Amount as _cln_Amount,
  Amount__Output as _cln_Amount__Output,
} from '../cln/Amount'
import type { Long } from '@grpc/proto-loader'

export interface SendonionRequest {
  onion?: Buffer | Uint8Array | string
  payment_hash?: Buffer | Uint8Array | string
  label?: string
  shared_secrets?: (Buffer | Uint8Array | string)[]
  partid?: number
  bolt11?: string
  destination?: Buffer | Uint8Array | string
  localofferid?: Buffer | Uint8Array | string
  groupid?: number | string | Long
  amount_msat?: _cln_Amount | null
  _label?: 'label'
  _partid?: 'partid'
  _bolt11?: 'bolt11'
  _amount_msat?: 'amount_msat'
  _destination?: 'destination'
  _localofferid?: 'localofferid'
  _groupid?: 'groupid'
}

export interface SendonionRequest__Output {
  onion: Buffer
  payment_hash: Buffer
  label?: string
  shared_secrets: Buffer[]
  partid?: number
  bolt11?: string
  destination?: Buffer
  localofferid?: Buffer
  groupid?: string
  amount_msat?: _cln_Amount__Output | null
  _label: 'label'
  _partid: 'partid'
  _bolt11: 'bolt11'
  _amount_msat: 'amount_msat'
  _destination: 'destination'
  _localofferid: 'localofferid'
  _groupid: 'groupid'
}
