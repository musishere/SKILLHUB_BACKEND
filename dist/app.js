"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const Logger_1 = require("./utils/Logger");
const Auth_Route_1 = require("./modules/auth/Auth.Route");
const course_Route_1 = require("./modules/course/course.Route"); // ✅ Course routes added
// import { lessonRoutes } from "./modules/lesson/Lesson.Route"; // 👈 Enable when ready
// Load environment variables
dotenv_1.default.config();
// Create Fastify instance
exports.app = (0, fastify_1.default)({
    logger: false,
});
// Enable CORS
exports.app.register(cors_1.default, {
    origin: "*",
});
// Health check route
exports.app.get("/health", async (req, reply) => {
    return { status: "OK", message: "Server is running" };
});
// ====================
// 📦 Register All Routes
// ====================
exports.app.register(Auth_Route_1.authRoutes, { prefix: "/api/auth" });
exports.app.register(course_Route_1.courseRoutes, { prefix: "/api/courses" }); // ✅ Now active
// app.register(lessonRoutes, { prefix: "/api/lessons" }); // 👈 Will activate soon
// ====================
// 🔥 Global Error Handler
// ====================
exports.app.setErrorHandler((error, request, reply) => {
    Logger_1.logger.error(error);
    if (error instanceof Error) {
        return reply.status(400).send({ error: error.message });
    }
    return reply.status(500).send({ error: "Internal Server Error" });
});
// ====================
// 🚀 Start Server
// ====================
const startServer = async () => {
    try {
        const PORT = Number(process.env.PORT) || 3000;
        await exports.app.listen({ port: PORT, host: "0.0.0.0" });
        Logger_1.logger.info(`✅ Server running on http://localhost:${PORT}`);
    }
    catch (err) {
        Logger_1.logger.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};
startServer();
