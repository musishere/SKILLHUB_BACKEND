"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = globalErrorHandler;
function globalErrorHandler(error, _req, reply) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    reply.status(statusCode).send({
        success: false,
        statusCode,
        message,
    });
}
