// Enrollment Routes
// Registers enrollment management endpoints
import { FastifyInstance } from "fastify";
import { EnrollmentController } from "./enrollment.controller";

export async function enrollmentRoutes(app: FastifyInstance) {
  const controller = new EnrollmentController();
  // Enroll user
  app.post("/api/client/enrollments", controller.enroll);
  // Get enrollment status
  app.get("/api/client/enrollments", controller.getEnrollment);
}
