// User Subscription Service
// Handles user subscription business logic
import { setCache, getCache } from "../../utils/redisClient";
import {
  db,
  user_subscriptions as userSubscriptionsTable,
} from "../../db/Drizzle.config";

export class UserSubscriptionService {
  // Create a user subscription
  async createUserSubscription(userId: string, data: any) {
    // Insert user subscription in DB
    const { status, started_at, ended_at } = data;
    const [subscription] = await db
      .insert(userSubscriptionsTable)
      .values({
        user_id: userId,
        status: status || "ACTIVE",
        started_at: started_at || new Date().toISOString(),
        ended_at: ended_at || null,
      })
      .returning();
    // Invalidate cache
    const cacheKey = `user_subscriptions:${userId}`;
    await setCache(cacheKey, null, 0);
    return subscription;
  }

  // Get user subscriptions, using Redis cache
  async getUserSubscriptions(userId: string) {
    const cacheKey = `user_subscriptions:${userId}`;
    let subscriptions = await getCache(cacheKey);
    if (!subscriptions) {
      // Fetch from DB
      subscriptions = await db
        .select()
        .from(userSubscriptionsTable)
        .where(userSubscriptionsTable.user_id.eq(userId));
      await setCache(cacheKey, subscriptions, 3600);
    }
    return subscriptions;
  }
}
