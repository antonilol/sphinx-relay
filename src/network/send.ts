import { models } from '../models'
import * as LND from '../grpc/lightning'
import { personalizeMessage, decryptMessage } from '../utils/msg'
import * as tribes from '../utils/tribes'
import { tribeOwnerAutoConfirmation } from '../controllers/confirmations'
import { typesToForward } from './receive'
import * as intercept from './intercept'
import constants from '../constants'
import { logging, sphinxLogger } from '../utils/logger'
import { Msg } from './interfaces'

type NetworkType = undefined | 'mqtt' | 'lightning'

export async function sendMessage(params) {
  const {
    type,
    chat,
    message,
    sender,
    amount,
    success,
    failure,
    skipPubKey,
    isForwarded,
    forwardedFromContactId,
    realSatsContactId,
  } = params
  if (!chat || !sender) return
  const tenant: number = sender.id
  if (!tenant) return

  const isTribe = chat.type === constants.chat_types.tribe
  const isTribeOwner = isTribe && sender.publicKey === chat.ownerPubkey
  // console.log('-> sender.publicKey', sender.publicKey)
  // console.log('-> chat.ownerPubkey', chat.ownerPubkey)

  let theSender = sender.dataValues || sender
  if (isTribeOwner && !isForwarded) {
    theSender = {
      ...(sender.dataValues || sender),
      role: constants.chat_roles.owner,
    }
  }
  let msg = newmsg(type, chat, theSender, message, isForwarded)

  // console.log("=> MSG TO SEND",msg)

  // console.log(type,message)
  if (!(sender && sender.publicKey)) {
    // console.log("NO SENDER?????");
    return
  }

  let contactIds =
    (typeof chat.contactIds === 'string'
      ? JSON.parse(chat.contactIds)
      : chat.contactIds) || []
  let justMe = false
  if (contactIds.length === 1) {
    if (contactIds[0] === tenant) {
      // JUST ME!
      justMe = true
    }
  }

  let networkType: NetworkType = undefined
  const chatUUID = chat.uuid
  if (isTribe) {
    if (type === constants.message_types.confirmation) {
      // if u are owner, go ahead!
      if (!isTribeOwner) return // dont send confs for tribe if not owner
    }
    if (isTribeOwner) {
      networkType = 'mqtt' // broadcast to all
      // decrypt message.content and message.mediaKey w groupKey
      msg = await decryptMessage(msg, chat)
      // console.log("SEND.TS isBotMsg")
      sphinxLogger.info(
        `[Network] => isTribeAdmin msg sending... ${msg}`,
        logging.Network
      )
      const isBotMsg = await intercept.isBotMsg(
        msg,
        true,
        sender,
        forwardedFromContactId
      )
      if (isBotMsg === true) {
        sphinxLogger.info(`[Network] => isBotMsg`, logging.Network)
        // return // DO NOT FORWARD TO TRIBE, forwarded to bot instead?
      }
    }

    // stop here if just me
    if (justMe) {
      if (success) success(true)
      return // if no contacts thats fine (like create public tribe)
    }

    if (isTribeOwner) {
      try {
        // post last_active to tribes server
        tribes.putActivity(chat.uuid, chat.host, sender.publicKey)
      } catch (e) {
        // dont care about the error
      }
    } else {
      // if tribe, send to owner only
      const tribeOwner = await models.Contact.findOne({
        where: { publicKey: chat.ownerPubkey, tenant },
      })
      contactIds = tribeOwner ? [tribeOwner.id] : []
    }
  } else {
    // not a tribe
    if (justMe) {
      if (success) success(true)
      return
    }
  }

  let yes: any = true
  let no: any = null

  sphinxLogger.info(
    `=> sending to ${contactIds.length} 'contacts'`,
    logging.Network
  )
  await asyncForEach(contactIds, async (contactId) => {
    // console.log("=> TENANT", tenant)
    if (contactId === tenant) {
      // dont send to self
      // console.log('=> dont send to self')
      return
    }

    const contact = await models.Contact.findOne({ where: { id: contactId } })
    if (!contact) {
      // console.log('=> sendMessage no contact')
      return // skip if u simply dont have the contact
    }
    if (tenant === -1) {
      // this is a bot sent from me!
      if (contact.isOwner) {
        // console.log('=> dont MQTT to myself!')
        return // dont MQTT to myself!
      }
    }

    // console.log("=> CONTACT", contactId, contact.publicKey)
    const destkey = contact.publicKey
    if (destkey === skipPubKey) {
      // console.log('=> skipPubKey', skipPubKey)
      return // skip (for tribe owner broadcasting, not back to the sender)
    }
    // console.log('-> sending to ', contact.id, destkey)

    let mqttTopic = networkType === 'mqtt' ? `${destkey}/${chatUUID}` : ''

    // sending a payment to one subscriber, buying a pic from OG poster
    // or boost to og poster
    // console.log("=> istribeOwner", isTribeOwner)
    // console.log("=> amount", amount)
    // console.log("=> realSatsContactId", realSatsContactId, contactId)
    if (isTribeOwner && amount && realSatsContactId === contactId) {
      mqttTopic = '' // FORCE KEYSEND!!!
    }

    const m = await personalizeMessage(msg, contact, isTribeOwner)
    // console.log('-> personalized msg', m)
    const opts = {
      dest: destkey,
      data: m,
      amt: Math.max(amount || 0, constants.min_sat_amount),
      route_hint: contact.routeHint || '',
    }

    // console.log("==> SENDER",sender)
    // console.log("==> OK SIGN AND SEND", opts);
    try {
      const r = await signAndSend(opts, sender, mqttTopic)
      yes = r
    } catch (e) {
      sphinxLogger.error(`KEYSEND ERROR ${e}`)
      no = e
    }
    await sleep(10)
  })
  if (no) {
    if (failure) failure(no)
  } else {
    if (success) success(yes)
  }
}

export async function signAndSend(
  opts,
  owner: { [k: string]: any },
  mqttTopic?: string,
  replayingHistory?: boolean
) {
  // console.log('sign and send!',opts)
  const ownerPubkey = owner.publicKey
  const ownerID = owner.id
  if (!opts || typeof opts !== 'object') {
    throw new Error('object plz')
  }
  if (!opts.dest) {
    throw new Error('no dest pubkey')
  }
  let data = JSON.stringify(opts.data || {})
  opts.amt = opts.amt || 0

  const sig = await LND.signAscii(data, ownerPubkey)
  data = data + sig

  // console.log("-> ACTUALLY SEND: topic:", mqttTopic)
  if (mqttTopic) {
    await tribes.publish(mqttTopic, data, ownerPubkey, function (err) {
      if (err) {
        // TODO handle error
      }
      if (!replayingHistory) {
        if (mqttTopic) checkIfAutoConfirm(opts.data, ownerID)
      }
    })
  } else {
    await LND.keysendMessage({ ...opts, data }, ownerPubkey)
  }
  return true
}

function checkIfAutoConfirm(data, tenant) {
  if (typesToForward.includes(data.type)) {
    if (data.type === constants.message_types.delete) {
      return // dont auto confirm delete msg
    }
    tribeOwnerAutoConfirmation(data.message.id, data.chat.uuid, tenant)
  }
}

export function newmsg(
  type,
  chat,
  sender,
  message,
  isForwarded: boolean,
  includeStatus?: boolean
): Msg {
  const includeGroupKey =
    type === constants.message_types.group_create ||
    type === constants.message_types.group_invite
  const includeAlias =
    sender && sender.alias && chat.type === constants.chat_types.tribe
  let aliasToInclude = sender.alias
  if (!isForwarded && includeAlias && chat.myAlias) {
    aliasToInclude = chat.myAlias
  }
  const includePhotoUrl =
    sender &&
    !sender.privatePhoto &&
    chat &&
    chat.type === constants.chat_types.tribe
  let photoUrlToInclude = sender.photoUrl || ''
  if (!isForwarded && includePhotoUrl && chat.myPhotoUrl) {
    photoUrlToInclude = chat.myPhotoUrl
  }
  if (!includeStatus && message.status) {
    delete message.status
  }
  return {
    type: type,
    chat: {
      uuid: chat.uuid,
      ...(chat.name && { name: chat.name }),
      ...((chat.type || chat.type === 0) && { type: chat.type }),
      ...(chat.members && { members: chat.members }),
      ...(includeGroupKey && chat.groupKey && { groupKey: chat.groupKey }),
      ...(includeGroupKey && chat.host && { host: chat.host }),
    },
    message: message,
    sender: {
      pub_key: sender.publicKey,
      ...(sender.routeHint && { route_hint: sender.routeHint }),
      alias: includeAlias ? aliasToInclude : '',
      role: sender.role || constants.chat_roles.reader,
      ...(includePhotoUrl && { photo_url: photoUrlToInclude }),
      // ...sender.contactKey && {contact_key: sender.contactKey}
    },
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// function urlBase64FromHex(ascii){
//     return Buffer.from(ascii,'hex').toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
// }
// function urlBase64FromBytes(buf){
//     return Buffer.from(buf).toString('base64').replace(/\//g, '_').replace(/\+/g, '-')
// }
