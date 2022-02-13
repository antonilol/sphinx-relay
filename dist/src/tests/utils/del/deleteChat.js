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
exports.deleteChat = void 0;
const http = require("ava-http");
const helpers_1 = require("../helpers");
function deleteChat(t, node, chatID) {
    return __awaiter(this, void 0, void 0, function* () {
        const deletion = yield http.del(node.external_ip + '/chat/' + chatID, (0, helpers_1.makeArgs)(node));
        t.true(deletion.success, 'node should delete the chat');
        return true;
    });
}
exports.deleteChat = deleteChat;
//# sourceMappingURL=deleteChat.js.map