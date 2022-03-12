import type { Contact } from '../models'

export interface MessageContent {
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
  purchaser?: number
  invoice?: string
  parentId?: number
}

export interface ChatContent {
  uuid: string
  type?: number
  members?: { [k: string]: any }
  name?: string
  groupKey?: string
  host?: string
  myAlias?: string
  myPhotoUrl?: string
}

export interface SenderContent {
  id?: number
  pub_key: string
  alias: string
  role: number
  route_hint?: string
  photo_url?: string
  contact_key?: string
}

export interface Msg {
  type: number
  message: MessageContent
  chat: ChatContent
  sender: SenderContent
  bot_id?: any
  bot_uuid?: string
  bot_name?: string
  recipient_id?: any
  action?: string
}

interface PayloadMessageContent extends MessageContent {
  remoteContent?: string
  skipPaymentProcessing?: boolean
}

export interface Payload extends Msg {
  network_type?: number
  isTribeOwner?: boolean
  dest?: string
  owner: Contact
  message: PayloadMessageContent
}
