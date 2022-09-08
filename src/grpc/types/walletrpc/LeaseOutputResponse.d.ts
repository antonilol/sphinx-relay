/// <reference types="long" />
import type { Long } from '@grpc/proto-loader'
export interface LeaseOutputResponse {
  expiration?: number | string | Long
}
export interface LeaseOutputResponse__Output {
  expiration: string
}
