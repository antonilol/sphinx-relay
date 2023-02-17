// Original file: proto/cln/node.proto

import type {
  Amount as _cln_Amount,
  Amount__Output as _cln_Amount__Output,
} from '../cln/Amount'

export interface ListpeersPeersChannelsFunding {
  local_msat?: _cln_Amount | null
  remote_msat?: _cln_Amount | null
  pushed_msat?: _cln_Amount | null
}

export interface ListpeersPeersChannelsFunding__Output {
  local_msat: _cln_Amount__Output | null
  remote_msat: _cln_Amount__Output | null
  pushed_msat: _cln_Amount__Output | null
}
