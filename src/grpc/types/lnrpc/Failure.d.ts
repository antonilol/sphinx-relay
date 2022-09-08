/// <reference types="long" />
/// <reference types="node" />
import type {
  ChannelUpdate as _lnrpc_ChannelUpdate,
  ChannelUpdate__Output as _lnrpc_ChannelUpdate__Output,
} from '../lnrpc/ChannelUpdate'
import type { Long } from '@grpc/proto-loader'
export declare enum _lnrpc_Failure_FailureCode {
  RESERVED = 0,
  INCORRECT_OR_UNKNOWN_PAYMENT_DETAILS = 1,
  INCORRECT_PAYMENT_AMOUNT = 2,
  FINAL_INCORRECT_CLTV_EXPIRY = 3,
  FINAL_INCORRECT_HTLC_AMOUNT = 4,
  FINAL_EXPIRY_TOO_SOON = 5,
  INVALID_REALM = 6,
  EXPIRY_TOO_SOON = 7,
  INVALID_ONION_VERSION = 8,
  INVALID_ONION_HMAC = 9,
  INVALID_ONION_KEY = 10,
  AMOUNT_BELOW_MINIMUM = 11,
  FEE_INSUFFICIENT = 12,
  INCORRECT_CLTV_EXPIRY = 13,
  CHANNEL_DISABLED = 14,
  TEMPORARY_CHANNEL_FAILURE = 15,
  REQUIRED_NODE_FEATURE_MISSING = 16,
  REQUIRED_CHANNEL_FEATURE_MISSING = 17,
  UNKNOWN_NEXT_PEER = 18,
  TEMPORARY_NODE_FAILURE = 19,
  PERMANENT_NODE_FAILURE = 20,
  PERMANENT_CHANNEL_FAILURE = 21,
  EXPIRY_TOO_FAR = 22,
  MPP_TIMEOUT = 23,
  INVALID_ONION_PAYLOAD = 24,
  INTERNAL_FAILURE = 997,
  UNKNOWN_FAILURE = 998,
  UNREADABLE_FAILURE = 999,
}
export interface Failure {
  code?: _lnrpc_Failure_FailureCode | keyof typeof _lnrpc_Failure_FailureCode
  channel_update?: _lnrpc_ChannelUpdate | null
  htlc_msat?: number | string | Long
  onion_sha_256?: Buffer | Uint8Array | string
  cltv_expiry?: number
  flags?: number
  failure_source_index?: number
  height?: number
}
export interface Failure__Output {
  code: keyof typeof _lnrpc_Failure_FailureCode
  channel_update: _lnrpc_ChannelUpdate__Output | null
  htlc_msat: string
  onion_sha_256: Buffer
  cltv_expiry: number
  flags: number
  failure_source_index: number
  height: number
}
