// Action Log Controller
// Handles admin action log endpoints
import { ActionLogService } from "./actionLog.service";
import { logger } from "../../utils/Logger";

const actionLogService = new ActionLogService();

export class ActionLogController {
  // List admin action logs
  async listActionLogs(req, res) {
    logger.info(
      { admin: req.user?.id },
      "List admin action logs request received"
    );
    try {
      const logs = await actionLogService.listActionLogs();
      logger.info({ logs }, "Admin action logs fetched successfully");
      res.send(logs);
    } catch (err) {
      logger.error({ err }, "Failed to list admin action logs");
      res.status(500).send({ error: "Failed to list admin action logs" });
    }
  }
}
