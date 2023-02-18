// Original file: proto/cln/node.proto

import type {
  Amount as _cln_Amount,
  Amount__Output as _cln_Amount__Output,
} from '../cln/Amount'
import type {
  Feerate as _cln_Feerate,
  Feerate__Output as _cln_Feerate__Output,
} from '../cln/Feerate'

export interface FundpsbtRequest {
  satoshi?: _cln_Amount | null
  feerate?: _cln_Feerate | null
  startweight?: number
  minconf?: number
  reserve?: number
  locktime?: number
  min_witness_weight?: number
  excess_as_change?: boolean
  _minconf?: 'minconf'
  _reserve?: 'reserve'
  _locktime?: 'locktime'
  _min_witness_weight?: 'min_witness_weight'
  _excess_as_change?: 'excess_as_change'
}

export interface FundpsbtRequest__Output {
  satoshi: _cln_Amount__Output | null
  feerate: _cln_Feerate__Output | null
  startweight: number
  minconf?: number
  reserve?: number
  locktime?: number
  min_witness_weight?: number
  excess_as_change?: boolean
  _minconf: 'minconf'
  _reserve: 'reserve'
  _locktime: 'locktime'
  _min_witness_weight: 'min_witness_weight'
  _excess_as_change: 'excess_as_change'
}
