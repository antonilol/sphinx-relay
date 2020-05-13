"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ldat_1 = require("./ldat");
const path = require("path");
const rsa = require("../crypto/rsa");
const constants = require(path.join(__dirname, '../../config/constants.json'));
function addInRemoteText(full, contactId, isTribe) {
    const m = full && full.message;
    console.log('m && m.content', m && m.content);
    console.log('typeof m.content', typeof m.content);
    if (!(m && m.content))
        return full;
    if (!(typeof m.content === 'object'))
        return full;
    console.log('contactId', contactId);
    console.log('isTribe', isTribe);
    if (isTribe) {
        // if just one, send it (for tribe remote_text_map... is there a better way?)
        if (Object.values(m.content).length === 1) {
            return fillmsg(full, { content: Object.values(m.content)[0] });
        }
    }
    return fillmsg(full, { content: m.content[contactId + ''] });
}
function removeRecipientFromChatMembers(full, destkey) {
    const c = full && full.chat;
    if (!(c && c.members))
        return full;
    if (!(typeof c.members === 'object'))
        return full;
    const members = Object.assign({}, c.members);
    if (members[destkey])
        delete members[destkey];
    return fillchatmsg(full, { members });
}
function removeAllNonAdminMembersIfTribe(full, destkey) {
    return full;
    // const c = full && full.chat
    // if (!(c && c.members)) return full
    // if (!(typeof c.members==='object')) return full
    // const members = {...c.members}
    // if(members[destkey]) delete members[destkey]
    // return fillchatmsg(full, {members})
}
// THIS IS ONLY FOR TRIBE OWNER
// by this time the content and mediaKey are already in message as string
function encryptTribeBroadcast(full, contact, isTribe, isTribeOwner) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!isTribeOwner)
            return full;
        const chat = full && full.chat;
        const message = full && full.message;
        if (!message || !(chat && chat.type && chat.uuid))
            return full;
        const obj = {};
        if (isTribe && isTribeOwner) { // has been previously decrypted
            if (message.content) {
                const encContent = yield rsa.encrypt(contact.contactKey, message.content);
                obj.content = encContent;
            }
            if (message.mediaKey) {
                const encMediaKey = yield rsa.encrypt(contact.contactKey, message.mediaKey);
                obj.mediaKey = encMediaKey;
            }
        }
        return fillmsg(full, obj);
    });
}
function addInMediaKey(full, contactId) {
    const m = full && full.message;
    if (!(m && m.mediaKey))
        return full;
    if (!(m && m.mediaTerms))
        return full;
    if (!(typeof m.mediaKey === 'object'))
        return full;
    const mediaKey = m.mediaTerms.skipSigning ? '' : m.mediaKey[contactId + ''];
    return fillmsg(full, { mediaKey });
}
// add the token if its free, but if a price just the base64(host).muid
function finishTermsAndReceipt(full, destkey) {
    return __awaiter(this, void 0, void 0, function* () {
        const m = full && full.message;
        if (!(m && m.mediaTerms))
            return full;
        const t = m.mediaTerms;
        const meta = t.meta || {};
        t.ttl = t.ttl || 31536000;
        meta.ttl = t.ttl;
        const mediaToken = yield ldat_1.tokenFromTerms({
            host: t.host || '',
            muid: t.muid,
            ttl: t.skipSigning ? 0 : t.ttl,
            pubkey: t.skipSigning ? '' : destkey,
            meta
        });
        const fullmsg = fillmsg(full, { mediaToken });
        delete fullmsg.message.mediaTerms;
        return fullmsg;
    });
}
// DECRYPT EITHER STRING OR FIRST VAL IN OBJ
function decryptMessage(full, chat) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!chat.groupPrivateKey)
            return full;
        const m = full && full.message;
        if (!m)
            return full;
        const obj = {};
        if (m.content) {
            console.log('m.content:', m.content, typeof m.content);
            let content = m.content;
            if (typeof m.content === 'object') {
                if (Object.values(m.content).length) {
                    content = Object.values(m.content)[0];
                }
            }
            console.log("CONTENT TO DECRYPT:", content);
            const decContent = rsa.decrypt(chat.groupPrivateKey, content);
            obj.content = decContent;
        }
        if (m.mediaKey) {
            let mediaKey = m.mediaKey;
            if (typeof m.mediaKey === 'object') {
                if (Object.values(m.mediaKey).length) {
                    mediaKey = Object.values(m.mediaKey)[0];
                }
            }
            const decMediaKey = rsa.decrypt(chat.groupPrivateKey, mediaKey);
            obj.mediaKey = decMediaKey;
        }
        console.log("OBJ FILLED", fillmsg(full, obj));
        return fillmsg(full, obj);
    });
}
exports.decryptMessage = decryptMessage;
function personalizeMessage(m, contact, isTribeOwner) {
    return __awaiter(this, void 0, void 0, function* () {
        const contactId = contact.contactId;
        const destkey = contact.publicKey;
        const cloned = JSON.parse(JSON.stringify(m));
        console.log('cloned', cloned);
        const chat = cloned && cloned.chat;
        const isTribe = chat.type && chat.type === constants.chat_types.tribe;
        const msgWithRemoteTxt = addInRemoteText(cloned, contactId, isTribe);
        console.log('msgWithRemoteTxt', msgWithRemoteTxt);
        const cleanMsg = removeRecipientFromChatMembers(msgWithRemoteTxt, destkey);
        const cleanerMsg = removeAllNonAdminMembersIfTribe(cleanMsg, destkey);
        const msgWithMediaKey = addInMediaKey(cleanerMsg, contactId);
        const msgWithMediaToken = yield finishTermsAndReceipt(msgWithMediaKey, destkey);
        const encMsg = yield encryptTribeBroadcast(msgWithMediaToken, contact, isTribe, isTribeOwner);
        console.log('encMsg', encMsg);
        return encMsg;
    });
}
exports.personalizeMessage = personalizeMessage;
function fillmsg(full, props) {
    return Object.assign(Object.assign({}, full), { message: Object.assign(Object.assign({}, full.message), props) });
}
function fillchatmsg(full, props) {
    return Object.assign(Object.assign({}, full), { chat: Object.assign(Object.assign({}, full.chat), props) });
}
//# sourceMappingURL=msg.js.map