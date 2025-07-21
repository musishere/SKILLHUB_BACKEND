"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.channel = exports.connection = exports.initRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
const Logger_1 = require("../utils/Logger");
const rabbitUrl = process.env.RABBITMQ_URL;
let connection;
let channel;
const initRabbitMQ = async () => {
    try {
        // The error is caused by a type mismatch: amqp.connect returns a Promise<amqp.Connection>, but the imported Connection type from "amqplib" may not match the actual runtime type.
        // Fix: Remove the explicit type import for Connection and Channel, and let TypeScript infer the types.
        exports.connection = connection = await amqplib_1.default.connect(rabbitUrl);
        Logger_1.logger.info("✅ Connected to RabbitMQ");
        exports.channel = channel = await connection.createChannel();
        Logger_1.logger.info("✅ Channel created");
        return { connection, channel };
    }
    catch (error) {
        Logger_1.logger.error("❌ RabbitMQ connection failed:", error);
        process.exit(1);
    }
};
exports.initRabbitMQ = initRabbitMQ;
