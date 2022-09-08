/// <reference types="long" />
import type { Long } from '@grpc/proto-loader'
export interface AddressProperty {
  address?: string
  is_internal?: boolean
  balance?: number | string | Long
}
export interface AddressProperty__Output {
  address: string
  is_internal: boolean
  balance: string
}
