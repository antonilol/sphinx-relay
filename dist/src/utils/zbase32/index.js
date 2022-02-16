"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
require("./tv42_zbase32_gopherjs");
function encode(bytes) {
    return global['zbase32'].Encode(bytes);
}
exports.encode = encode;
function decode(txt) {
    return global['zbase32'].Decode(txt);
}
exports.decode = decode;
//# sourceMappingURL=index.js.map