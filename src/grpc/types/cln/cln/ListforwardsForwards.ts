// Original file: proto/cln/node.proto

import type {
  Amount as _cln_Amount,
  Amount__Output as _cln_Amount__Output,
} from '../cln/Amount'

// Original file: proto/cln/node.proto

export const _cln_ListforwardsForwards_ListforwardsForwardsStatus = {
  OFFERED: 'OFFERED',
  SETTLED: 'SETTLED',
  LOCAL_FAILED: 'LOCAL_FAILED',
  FAILED: 'FAILED',
} as const

export type _cln_ListforwardsForwards_ListforwardsForwardsStatus =
  | 'OFFERED'
  | 0
  | 'SETTLED'
  | 1
  | 'LOCAL_FAILED'
  | 2
  | 'FAILED'
  | 3

export type _cln_ListforwardsForwards_ListforwardsForwardsStatus__Output =
  (typeof _cln_ListforwardsForwards_ListforwardsForwardsStatus)[keyof typeof _cln_ListforwardsForwards_ListforwardsForwardsStatus]

// Original file: proto/cln/node.proto

export const _cln_ListforwardsForwards_ListforwardsForwardsStyle = {
  LEGACY: 'LEGACY',
  TLV: 'TLV',
} as const

export type _cln_ListforwardsForwards_ListforwardsForwardsStyle =
  | 'LEGACY'
  | 0
  | 'TLV'
  | 1

export type _cln_ListforwardsForwards_ListforwardsForwardsStyle__Output =
  (typeof _cln_ListforwardsForwards_ListforwardsForwardsStyle)[keyof typeof _cln_ListforwardsForwards_ListforwardsForwardsStyle]

export interface ListforwardsForwards {
  in_channel?: string
  in_msat?: _cln_Amount | null
  status?: _cln_ListforwardsForwards_ListforwardsForwardsStatus
  received_time?: number | string
  out_channel?: string
  payment_hash?: Buffer | Uint8Array | string
  fee_msat?: _cln_Amount | null
  out_msat?: _cln_Amount | null
  style?: _cln_ListforwardsForwards_ListforwardsForwardsStyle
  _out_channel?: 'out_channel'
  _payment_hash?: 'payment_hash'
  _style?: 'style'
  _fee_msat?: 'fee_msat'
  _out_msat?: 'out_msat'
}

export interface ListforwardsForwards__Output {
  in_channel: string
  in_msat: _cln_Amount__Output | null
  status: _cln_ListforwardsForwards_ListforwardsForwardsStatus__Output
  received_time: number
  out_channel?: string
  payment_hash?: Buffer
  fee_msat?: _cln_Amount__Output | null
  out_msat?: _cln_Amount__Output | null
  style?: _cln_ListforwardsForwards_ListforwardsForwardsStyle__Output
  _out_channel: 'out_channel'
  _payment_hash: 'payment_hash'
  _style: 'style'
  _fee_msat: 'fee_msat'
  _out_msat: 'out_msat'
}
