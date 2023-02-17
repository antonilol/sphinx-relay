// Original file: proto/cln/node.proto

// Original file: proto/cln/node.proto

export const _cln_NewaddrRequest_NewaddrAddresstype = {
  BECH32: 'BECH32',
  P2SH_SEGWIT: 'P2SH_SEGWIT',
  ALL: 'ALL',
} as const

export type _cln_NewaddrRequest_NewaddrAddresstype =
  | 'BECH32'
  | 0
  | 'P2SH_SEGWIT'
  | 1
  | 'ALL'
  | 2

export type _cln_NewaddrRequest_NewaddrAddresstype__Output =
  (typeof _cln_NewaddrRequest_NewaddrAddresstype)[keyof typeof _cln_NewaddrRequest_NewaddrAddresstype]

export interface NewaddrRequest {
  addresstype?: _cln_NewaddrRequest_NewaddrAddresstype
  _addresstype?: 'addresstype'
}

export interface NewaddrRequest__Output {
  addresstype?: _cln_NewaddrRequest_NewaddrAddresstype__Output
  _addresstype: 'addresstype'
}
