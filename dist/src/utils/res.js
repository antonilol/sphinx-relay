"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failure200 = exports.failure = exports.success = void 0;
const logger_1 = require("./logger");
// eslint-disable-next-line @typescript-eslint/ban-types
function success(res, json) {
    res.status(200);
    res.json({
        success: true,
        response: json,
    });
    res.end();
}
exports.success = success;
function failure(res, e) {
    const errorMessage = typeof e === 'string' ? e : e.message;
    logger_1.sphinxLogger.error(`--> failure: ${errorMessage}`);
    res.status(400);
    res.json({
        success: false,
        error: errorMessage,
    });
    res.end();
}
exports.failure = failure;
function failure200(res, e) {
    res.status(200);
    res.json({
        success: false,
        error: typeof e === 'string' ? e : e.message,
    });
    res.end();
}
exports.failure200 = failure200;
//# sourceMappingURL=res.js.map