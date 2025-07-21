// Progress Routes
// Registers user progress endpoints
import { FastifyInstance } from "fastify";
import { ProgressController } from "./progress.controller";

export async function progressRoutes(app: FastifyInstance) {
  const controller = new ProgressController();
  // Get user progress for a product
  app.get("/api/client/progress/:productId", controller.getProgress);
  // Update user progress for a product
  app.patch("/api/client/progress/:productId", controller.updateProgress);
}
