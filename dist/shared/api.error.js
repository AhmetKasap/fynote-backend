"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ApiError_1;
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
let ApiError = ApiError_1 = class ApiError extends Error {
    statusCode;
    message;
    details;
    validationErrors;
    constructor(statusCode, message, details, validationErrors) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
        this.validationErrors = validationErrors;
    }
    static BadRequest(message) {
        return new ApiError_1(400, message || "Bad Request");
    }
    static NotFound(message) {
        return new ApiError_1(404, message || "Not Found");
    }
    static Unauthorized(message) {
        return new ApiError_1(401, message || "Unauthorized");
    }
    static Forbidden(message) {
        return new ApiError_1(403, message || "Forbidden");
    }
    static InternalServerError(message) {
        return new ApiError_1(500, message || "Internal Server Error");
    }
    static NotImplemented(message) {
        return new ApiError_1(501, message || "Not Implemented");
    }
    static BadGateway(message) {
        return new ApiError_1(502, message || "Bad Gateway");
    }
    static ServiceUnavailable(message) {
        return new ApiError_1(503, message || "Service Unavailable");
    }
    static GatewayTimeout(message) {
        return new ApiError_1(504, message || "Gateway Timeout");
    }
    static PreconditionFailed(message) {
        return new ApiError_1(412, message || "Precondition Failed");
    }
    static RequestEntityTooLarge(message) {
        return new ApiError_1(413, message || "Request Entity Too Large");
    }
    static RequestURITooLong(message) {
        return new ApiError_1(414, message || "Request URI Too Long");
    }
    static UnsupportedMediaType(message) {
        return new ApiError_1(415, message || "Unsupported Media Type");
    }
    static RequestedRangeNotSatisfiable(message) {
        return new ApiError_1(416, message || "Requested Range Not Satisfiable");
    }
    static ExpectationFailed(message) {
        return new ApiError_1(417, message || "Expectation Failed");
    }
    static UnprocessableEntity(message) {
        return new ApiError_1(422, message || "Unprocessable Entity");
    }
    static Locked(message) {
        return new ApiError_1(423, message || "Locked");
    }
    static TooManyRequests(message) {
        return new ApiError_1(429, message || "Too Many Requests");
    }
    static NetworkAuthenticationRequired(message) {
        return new ApiError_1(511, message || "Network Authentication Required");
    }
    static ValidationError(message, validationErrors) {
        return new ApiError_1(400, message || "Validation Error", 400, validationErrors);
    }
};
ApiError = ApiError_1 = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [Number, String, Object, Array])
], ApiError);
exports.default = ApiError;
