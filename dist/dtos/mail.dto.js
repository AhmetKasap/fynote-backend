"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lang = exports.MailType = void 0;
var MailType;
(function (MailType) {
    MailType["VERIFICATION"] = "verification";
    MailType["PASSWORD_RESET"] = "password-reset";
    MailType["PASSWORD_CHANGED"] = "password-changed";
    MailType["ACCOUNT_DELETED"] = "account-deleted";
})(MailType || (exports.MailType = MailType = {}));
var Lang;
(function (Lang) {
    Lang["TR"] = "tr";
    Lang["EN"] = "en";
})(Lang || (exports.Lang = Lang = {}));
