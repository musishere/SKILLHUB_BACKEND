// Action Log Routes
// Registers admin action log endpoints
import { FastifyInstance } from "fastify";
import { ActionLogController } from "./actionLog.controller";

export async function actionLogRoutes(app: FastifyInstance) {
  const controller = new ActionLogController();
  // List admin action logs
  app.get("/api/admin/action-logs", controller.listActionLogs);
}
