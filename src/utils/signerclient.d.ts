import { ChannelCredentials } from 'grpc'

export interface Sig {
  signature: Buffer
}

export interface Options {
  msg: ByteBuffer | Buffer
  key_loc?: { key_family: number, key_index: number }
}

export class SignerClient {
  public constructor(ip: string, credentials: ChannelCredentials)
  public signMessage(options: Options, callback: (err: Error, sig: Sig) => void)
  public verifyMessage(options: Options, callback: (err: Error, res: unknown) => void) // TODO what type
}

export type Signer = { Signer: typeof SignerClient }
