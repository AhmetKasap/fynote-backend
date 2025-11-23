"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseBuilder {
    static ok(res, data, message = "Success") {
        return res
            .status(200)
            .json({ success: true, message, data });
    }
    static created(res, data, message = "Created") {
        return res
            .status(201)
            .json({ success: true, message, data });
    }
    static noContent(res) {
        return res.status(204).send();
    }
    static fail(res, message = "Bad Request", statusCode = 400, errors) {
        return res
            .status(statusCode)
            .json({ success: false, message, errors });
    }
}
exports.default = ResponseBuilder;
