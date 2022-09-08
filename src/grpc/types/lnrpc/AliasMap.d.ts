/// <reference types="long" />
import type { Long } from '@grpc/proto-loader'
export interface AliasMap {
  base_scid?: number | string | Long
  aliases?: (number | string | Long)[]
}
export interface AliasMap__Output {
  base_scid: string
  aliases: string[]
}
