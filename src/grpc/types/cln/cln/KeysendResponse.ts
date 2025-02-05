// Original file: proto/cln/node.proto

import type {
  Amount as _cln_Amount,
  Amount__Output as _cln_Amount__Output,
} from '../cln/Amount'

// Original file: proto/cln/node.proto

export const _cln_KeysendResponse_KeysendStatus = {
  COMPLETE: 'COMPLETE',
} as const

export type _cln_KeysendResponse_KeysendStatus = 'COMPLETE' | 0

export type _cln_KeysendResponse_KeysendStatus__Output =
  typeof _cln_KeysendResponse_KeysendStatus[keyof typeof _cln_KeysendResponse_KeysendStatus]

export interface KeysendResponse {
  payment_preimage?: Buffer | Uint8Array | string
  destination?: Buffer | Uint8Array | string
  payment_hash?: Buffer | Uint8Array | string
  created_at?: number | string
  parts?: number
  amount_msat?: _cln_Amount | null
  amount_sent_msat?: _cln_Amount | null
  warning_partial_completion?: string
  status?: _cln_KeysendResponse_KeysendStatus
  _destination?: 'destination'
  _warning_partial_completion?: 'warning_partial_completion'
}

export interface KeysendResponse__Output {
  payment_preimage: Buffer
  destination?: Buffer
  payment_hash: Buffer
  created_at: number
  parts: number
  amount_msat: _cln_Amount__Output | null
  amount_sent_msat: _cln_Amount__Output | null
  warning_partial_completion?: string
  status: _cln_KeysendResponse_KeysendStatus__Output
  _destination: 'destination'
  _warning_partial_completion: 'warning_partial_completion'
}
