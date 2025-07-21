// Notification Controller
// Handles notification endpoints
import { NotificationService } from "./notification.service";
import { logger } from "../../utils/Logger";
import { publishToQueue } from "../../utils/rabbitmqClient";

const notificationService = new NotificationService();

export class NotificationController {
  // List user notifications
  async listNotifications(req, res) {
    logger.info({ user: req.user?.id }, "List notifications request received");
    try {
      const userId = req.user?.id;
      const notifications = await notificationService.listNotifications(userId);
      logger.info({ notifications }, "Notifications fetched successfully");
      res.send(notifications);
    } catch (err) {
      logger.error({ err }, "Failed to list notifications");
      res.status(500).send({ error: "Failed to list notifications" });
    }
  }

  // Mark notification as read
  async markAsRead(req, res) {
    logger.info(
      { user: req.user?.id, params: req.params },
      "Mark notification as read request received"
    );
    try {
      const userId = req.user?.id;
      const notificationId = req.params.id;
      const result = await notificationService.markAsRead(
        userId,
        notificationId
      );
      logger.info({ result }, "Notification marked as read");
      await publishToQueue("notification_events", {
        type: "notification_read",
        userId,
        notificationId,
      });
      logger.info(
        { queue: "notification_events", userId, notificationId },
        "Notification event pushed to RabbitMQ"
      );
      res.send(result);
    } catch (err) {
      logger.error({ err }, "Failed to mark notification as read");
      res.status(500).send({ error: "Failed to mark notification as read" });
    }
  }
}
