/// <reference types="long" />
import type { Long } from '@grpc/proto-loader'
export interface WalletAccountBalance {
  confirmed_balance?: number | string | Long
  unconfirmed_balance?: number | string | Long
}
export interface WalletAccountBalance__Output {
  confirmed_balance: string
  unconfirmed_balance: string
}
