export interface Msg {
  type: number
  message: {
    uuid: string
    content: string
    amount: number
    id?: number
    replyUuid?: string
    mediaToken?: string
    mediaKey?: string
    mediaType?: string
    date?: string
    originalMuid?: string
    status?: number
    remoteContent?: string
    skipPaymentProcessing?: boolean
    purchaser?: number
  }
  chat: {
    uuid: string
    type?: number
    members?: { [k: string]: any }
    name?: string
    groupKey?: string
    host?: string
  }
  sender: {
    id?: number
    pub_key: string
    alias: string
    role: number
    route_hint?: string
    photo_url?: string
  }
  network_type?: number
  isTribeOwner?: boolean
  dest?: string
  owner?: any
  bot_id?: any
  bot_uuid: string
  bot_name?: string
  recipient_id?: any
  action?: string
}
