// Application Error Routes
// Registers application error log endpoints
import { FastifyInstance } from "fastify";
import { ApplicationErrorController } from "./applicationError.controller";

export async function applicationErrorRoutes(app: FastifyInstance) {
  const controller = new ApplicationErrorController();
  // List application errors
  app.get("/api/admin/application-errors", controller.listApplicationErrors);
}
