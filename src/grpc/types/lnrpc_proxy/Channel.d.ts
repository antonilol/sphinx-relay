/// <reference types="long" />
import type {
  HTLC as _lnrpc_proxy_HTLC,
  HTLC__Output as _lnrpc_proxy_HTLC__Output,
} from '../lnrpc_proxy/HTLC'
import type { CommitmentType as _lnrpc_proxy_CommitmentType } from '../lnrpc_proxy/CommitmentType'
import type {
  ChannelConstraints as _lnrpc_proxy_ChannelConstraints,
  ChannelConstraints__Output as _lnrpc_proxy_ChannelConstraints__Output,
} from '../lnrpc_proxy/ChannelConstraints'
import type { Long } from '@grpc/proto-loader'
export interface Channel {
  active?: boolean
  remote_pubkey?: string
  channel_point?: string
  chan_id?: number | string | Long
  capacity?: number | string | Long
  local_balance?: number | string | Long
  remote_balance?: number | string | Long
  commit_fee?: number | string | Long
  commit_weight?: number | string | Long
  fee_per_kw?: number | string | Long
  unsettled_balance?: number | string | Long
  total_satoshis_sent?: number | string | Long
  total_satoshis_received?: number | string | Long
  num_updates?: number | string | Long
  pending_htlcs?: _lnrpc_proxy_HTLC[]
  csv_delay?: number
  private?: boolean
  initiator?: boolean
  chan_status_flags?: string
  local_chan_reserve_sat?: number | string | Long
  remote_chan_reserve_sat?: number | string | Long
  static_remote_key?: boolean
  lifetime?: number | string | Long
  uptime?: number | string | Long
  close_address?: string
  commitment_type?:
    | _lnrpc_proxy_CommitmentType
    | keyof typeof _lnrpc_proxy_CommitmentType
  push_amount_sat?: number | string | Long
  thaw_height?: number
  local_constraints?: _lnrpc_proxy_ChannelConstraints | null
  remote_constraints?: _lnrpc_proxy_ChannelConstraints | null
}
export interface Channel__Output {
  active: boolean
  remote_pubkey: string
  channel_point: string
  chan_id: string
  capacity: string
  local_balance: string
  remote_balance: string
  commit_fee: string
  commit_weight: string
  fee_per_kw: string
  unsettled_balance: string
  total_satoshis_sent: string
  total_satoshis_received: string
  num_updates: string
  pending_htlcs: _lnrpc_proxy_HTLC__Output[]
  csv_delay: number
  private: boolean
  initiator: boolean
  chan_status_flags: string
  local_chan_reserve_sat: string
  remote_chan_reserve_sat: string
  static_remote_key: boolean
  lifetime: string
  uptime: string
  close_address: string
  commitment_type: keyof typeof _lnrpc_proxy_CommitmentType
  push_amount_sat: string
  thaw_height: number
  local_constraints: _lnrpc_proxy_ChannelConstraints__Output | null
  remote_constraints: _lnrpc_proxy_ChannelConstraints__Output | null
}
