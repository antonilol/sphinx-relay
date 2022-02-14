export class WalletClient {
  public constructor(ip: string, credentials: ChannelCredentials)
  public listUnspent(opts: { [k: string]: unknown }, cb: (err: Error | undefined, res: { utxos: UTXO }) => void): void
  // ... TODO more RPCs when needed
}

export type WalletKit = { WalletKit: typeof WalletKit }
