// Notification Service
// Handles notification business logic
import {
  db,
  notifications as notificationsTable,
} from "../../db/Drizzle.config";

export class NotificationService {
  // List user notifications
  async listNotifications(userId: string) {
    // Fetch from DB
    let notifications = await db
      .select()
      .from(notificationsTable)
      .where(notificationsTable.user_id.eq(userId));
    // Cast read to boolean for API response
    notifications = notifications.map((n) => ({
      ...n,
      read: n.read === "true",
    }));
    return notifications;
  }

  // Mark notification as read
  async markAsRead(userId: string, notificationId: string) {
    // Update in DB
    const [notification] = await db
      .update(notificationsTable)
      .set({ read: "true" })
      .where(
        notificationsTable.id
          .eq(notificationId)
          .and(notificationsTable.user_id.eq(userId))
      )
      .returning();
    // Cast read to boolean for API response
    notification.read = notification.read === "true";
    return notification;
  }
}
