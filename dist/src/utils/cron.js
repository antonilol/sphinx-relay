"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.make = exports.parse = void 0;
const parser = require("cron-parser");
// a day in milliseconds
const day = 24 * 60 * 60 * 1000;
function daily() {
    const now = new Date();
    const minute = now.getMinutes();
    const hour = now.getHours();
    return `${minute} ${hour} * * *`;
}
function weekly() {
    const now = new Date();
    const minute = now.getMinutes();
    const hour = now.getHours();
    const dayOfWeek = now.getDay();
    return `${minute} ${hour} * * ${dayOfWeek}`;
}
function monthly() {
    const now = new Date();
    const minute = now.getMinutes();
    const hour = now.getHours();
    const dayOfMonth = now.getDate();
    return `${minute} ${hour} ${dayOfMonth} * *`;
}
function parse(s) {
    const next = parser.parseExpression(s).next().toString();
    if (s.endsWith(' * * *')) {
        return { interval: 'daily', next, ms: day };
    }
    if (s.endsWith(' * *')) {
        return { interval: 'monthly', next, ms: day * 30 };
    }
    return { interval: 'weekly', next, ms: day * 7 };
}
exports.parse = parse;
function make(interval) {
    if (interval === 'daily')
        return daily();
    if (interval === 'weekly')
        return weekly();
    if (interval === 'monthly')
        return monthly();
    throw new Error('Invalid interval');
}
exports.make = make;
//# sourceMappingURL=cron.js.map