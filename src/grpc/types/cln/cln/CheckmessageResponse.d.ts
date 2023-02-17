// Original file: proto/cln/node.proto

export interface CheckmessageResponse {
  verified?: boolean
  pubkey?: Buffer | Uint8Array | string
  _pubkey?: 'pubkey'
}

export interface CheckmessageResponse__Output {
  verified: boolean
  pubkey?: Buffer
  _pubkey: 'pubkey'
}
