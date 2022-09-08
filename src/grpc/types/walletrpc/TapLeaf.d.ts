/// <reference types="node" />
export interface TapLeaf {
  leaf_version?: number
  script?: Buffer | Uint8Array | string
}
export interface TapLeaf__Output {
  leaf_version: number
  script: Buffer
}
