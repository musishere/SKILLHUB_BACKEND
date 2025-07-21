"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const Logger_1 = require("../utils/Logger");
const redisUrl = process.env.REDIS_URL;
exports.redis = new ioredis_1.default(redisUrl);
exports.redis.on("connect", () => {
    Logger_1.logger.info("🟢 Redis connected successfully.");
});
exports.redis.on("error", (err) => {
    Logger_1.logger.error("🔴 Redis connection error:", err);
});
