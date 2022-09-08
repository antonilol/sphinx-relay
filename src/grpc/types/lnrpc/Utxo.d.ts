/// <reference types="long" />
import type { AddressType as _lnrpc_AddressType } from '../lnrpc/AddressType'
import type {
  OutPoint as _lnrpc_OutPoint,
  OutPoint__Output as _lnrpc_OutPoint__Output,
} from '../lnrpc/OutPoint'
import type { Long } from '@grpc/proto-loader'
export interface Utxo {
  address_type?: _lnrpc_AddressType | keyof typeof _lnrpc_AddressType
  address?: string
  amount_sat?: number | string | Long
  pk_script?: string
  outpoint?: _lnrpc_OutPoint | null
  confirmations?: number | string | Long
}
export interface Utxo__Output {
  address_type: keyof typeof _lnrpc_AddressType
  address: string
  amount_sat: string
  pk_script: string
  outpoint: _lnrpc_OutPoint__Output | null
  confirmations: string
}
