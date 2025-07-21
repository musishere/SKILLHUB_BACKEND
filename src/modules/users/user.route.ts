// User Routes
// Registers user management endpoints
import { FastifyInstance } from "fastify";
import { UserController } from "./user.controller";
import { authenticate } from "../../middleware/autheticate";

export async function userRoutes(app: FastifyInstance) {
  const controller = new UserController();
  // Get user profile
  app.get("/me", { preHandler: [authenticate] }, controller.getProfile);
  // Update user profile
  app.put("/me", { preHandler: [authenticate] }, controller.updateProfile);
  // Student dashboard endpoint
  app.get(
    "/dashboard",
    { preHandler: [authenticate] },
    controller.getStudentDashboard
  );
  // Certificates endpoint
  app.get(
    "/certificates",
    { preHandler: [authenticate] },
    controller.getCertificates
  );
  // Achievements endpoint
  app.get(
    "/achievements",
    { preHandler: [authenticate] },
    controller.getAchievements
  );
  // Reminders endpoints
  app.get(
    "/reminders",
    { preHandler: [authenticate] },
    controller.getReminders
  );
  app.post(
    "/reminders",
    { preHandler: [authenticate] },
    controller.updateReminders
  );
  // In-progress content endpoint
  app.get(
    "/in-progress",
    { preHandler: [authenticate] },
    controller.getInProgressContent
  );
}
