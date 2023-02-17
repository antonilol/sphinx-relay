// Original file: proto/cln/node.proto

import type {
  Amount as _cln_Amount,
  Amount__Output as _cln_Amount__Output,
} from '../cln/Amount'
import type { Long } from '@grpc/proto-loader'

// Original file: proto/cln/node.proto

export const _cln_ListpaysPays_ListpaysPaysStatus = {
  PENDING: 'PENDING',
  FAILED: 'FAILED',
  COMPLETE: 'COMPLETE',
} as const

export type _cln_ListpaysPays_ListpaysPaysStatus =
  | 'PENDING'
  | 0
  | 'FAILED'
  | 1
  | 'COMPLETE'
  | 2

export type _cln_ListpaysPays_ListpaysPaysStatus__Output =
  (typeof _cln_ListpaysPays_ListpaysPaysStatus)[keyof typeof _cln_ListpaysPays_ListpaysPaysStatus]

export interface ListpaysPays {
  payment_hash?: Buffer | Uint8Array | string
  status?: _cln_ListpaysPays_ListpaysPaysStatus
  destination?: Buffer | Uint8Array | string
  created_at?: number | string | Long
  label?: string
  bolt11?: string
  bolt12?: string
  amount_msat?: _cln_Amount | null
  amount_sent_msat?: _cln_Amount | null
  erroronion?: Buffer | Uint8Array | string
  description?: string
  _destination?: 'destination'
  _label?: 'label'
  _bolt11?: 'bolt11'
  _description?: 'description'
  _bolt12?: 'bolt12'
  _amount_msat?: 'amount_msat'
  _amount_sent_msat?: 'amount_sent_msat'
  _erroronion?: 'erroronion'
}

export interface ListpaysPays__Output {
  payment_hash: Buffer
  status: _cln_ListpaysPays_ListpaysPaysStatus__Output
  destination?: Buffer
  created_at: string
  label?: string
  bolt11?: string
  bolt12?: string
  amount_msat?: _cln_Amount__Output | null
  amount_sent_msat?: _cln_Amount__Output | null
  erroronion?: Buffer
  description?: string
  _destination: 'destination'
  _label: 'label'
  _bolt11: 'bolt11'
  _description: 'description'
  _bolt12: 'bolt12'
  _amount_msat: 'amount_msat'
  _amount_sent_msat: 'amount_sent_msat'
  _erroronion: 'erroronion'
}
