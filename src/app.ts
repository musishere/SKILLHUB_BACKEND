/**
 * Main Fastify application entry point.
 *
 * Features:
 * - Modular route registration
 * - Global error handling
 * - Security headers (helmet)
 * - CORS
 * - Redis health check and caching
 * - Rate limiting middleware
 * - RabbitMQ health check
 * - Environment/config management
 * - Production-ready structure
 */

import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import dotenv from "dotenv";
import { logger } from "./utils/Logger";
import { authRoutes } from "./modules/auth/Auth.Route";
import { config } from "./utils/config";
import { checkRedisHealth } from "./utils/redis";
import { globalErrorHandler } from "./middleware/ErrorHandler";
import { rateLimit } from "./middleware/rateLimit";
import { initRabbitMQ, channel } from "./utils/rabbitmq";
import { redisHealthCheck } from "./utils/redisClient";
import { rabbitMQHealthCheck } from "./utils/rabbitmqClient";

// 📦 All route imports
import { courseRoutes } from "./modules/course/course.Route";
import { schoolRoutes } from "./modules/school/school.Route";
// import { lessonRoutes } from "./modules/lesson/Lesson.Route"; // ⏳ Coming soon

// Import all new route modules
import { enrollmentRoutes } from "./modules/enrollments/enrollment.route";
import { progressRoutes } from "./modules/progress/progress.route";
import { transactionRoutes } from "./modules/financials/transaction.route";
import { userSubscriptionRoutes } from "./modules/financials/userSubscription.route";
import { couponRoutes } from "./modules/financials/coupon.route";
import { payoutRoutes } from "./modules/financials/payout.route";
import { reviewRoutes } from "./modules/community/review.route";
import { communityPostRoutes } from "./modules/community/communityPost.route";
import { spaceMemberRoutes } from "./modules/community/spaceMember.route";
import { teamPlanRoutes } from "./modules/team-plans/teamPlan.route";
import { teamPlanMemberRoutes } from "./modules/team-plans/teamPlanMember.route";
import { notificationRoutes } from "./modules/notifications/notification.route";
import { actionLogRoutes } from "./modules/logs/actionLog.route";
import { applicationErrorRoutes } from "./modules/logs/applicationError.route";
import { platformSettingsRoutes } from "./modules/settings/platformSettings.route";
import { learnworldsWebhookHandler } from "./webhooks/learnworldsWebhook.controller";
import { userRoutes } from "./modules/users/user.route";

// 🌱 Load environment variables
dotenv.config();

// ============================
// RabbitMQ Consumers
// ============================
// Load background consumers (e.g., course_created_queue)
import "./Jobs/queue.processor";

// ============================
// App Initialization
// ============================
export const app = Fastify({
  logger: false,
});

// ============================
// Middleware Registration
// ============================
app.register(cors, {
  origin: "*",
});
app.register(helmet);

// Apply rate limiting globally
app.addHook("onRequest", rateLimit);

// ============================
// Health Check Endpoint
// ============================
app.get("/health", async (req, reply) => {
  try {
    const redisOk = await redisHealthCheck();
    const rabbitOk = await rabbitMQHealthCheck();
    // TODO: Add DB health check (simulate as true for now)
    const dbOk = true;
    reply.send({
      status: redisOk && rabbitOk && dbOk ? "ok" : "degraded",
      redis: redisOk,
      rabbitmq: rabbitOk,
      db: dbOk,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    reply.status(500).send({ status: "error", error: message });
  }
});

// ============================
// Route Registration
// ============================
app.register(authRoutes, { prefix: "/api/auth" });
app.register(courseRoutes, { prefix: "/api/courses" });
app.register(schoolRoutes, { prefix: "/api/schools" });
// app.register(lessonRoutes, { prefix: "/api/lessons" }); // ⏳ Coming soon

// Register all new routes
app.register(enrollmentRoutes);
app.register(progressRoutes);
app.register(transactionRoutes);
app.register(userSubscriptionRoutes);
app.register(couponRoutes);
app.register(payoutRoutes);
app.register(reviewRoutes);
app.register(communityPostRoutes);
app.register(spaceMemberRoutes);
app.register(teamPlanRoutes);
app.register(teamPlanMemberRoutes);
app.register(notificationRoutes);
app.register(actionLogRoutes);
app.register(applicationErrorRoutes);
app.register(platformSettingsRoutes);
app.register(userRoutes, { prefix: "/api/client" });
// Register LearnWorlds webhook endpoint
app.post("/api/webhooks/learnworlds", learnworldsWebhookHandler);

// ============================
// Global Error Handler
// ============================
app.setErrorHandler(globalErrorHandler);

// ============================
// Server Startup
// ============================
const startServer = async () => {
  try {
    // Ensure RabbitMQ is initialized before starting the server
    await initRabbitMQ();
    logger.info("✅ RabbitMQ initialized");

    const PORT = Number(config.PORT) || 3000;
    await app.listen({ port: PORT, host: "0.0.0.0" });
    logger.info(`✅ Server running on http://localhost:${PORT}`);
  } catch (err) {
    logger.error("❌ Failed to start server:", err);
    console.error(err); // Print full error and stack trace
    process.exit(1);
  }
};

startServer();
