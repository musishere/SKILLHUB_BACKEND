// Action Log Service
// Handles admin action log business logic
import { db, action_logs as actionLogsTable } from "../../db/Drizzle.config";

export class ActionLogService {
  // List admin action logs
  async listActionLogs() {
    // Fetch from DB
    const logs = await db.select().from(actionLogsTable);
    return logs;
  }
}
