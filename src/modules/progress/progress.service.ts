// Progress Service
// Handles user progress business logic
import { setCache, getCache } from "../../utils/redisClient";
import { db, progress as progressTable } from "../../db/Drizzle.config";

export class ProgressService {
  // Get user progress for a product, using Redis cache
  async getProgress(userId: string, productId: string) {
    const cacheKey = `progress:${userId}:${productId}`;
    let progressRecord = await getCache(cacheKey);
    if (!progressRecord) {
      // Fetch from DB
      [progressRecord] = await db
        .select()
        .from(progressTable)
        .where(
          progressTable.user_id
            .eq(userId)
            .and(progressTable.product_id.eq(productId))
        );
      if (progressRecord) {
        await setCache(cacheKey, progressRecord, 3600);
      }
    }
    // Cast progress to number for API response
    if (progressRecord) {
      progressRecord.progress = Number(progressRecord.progress);
    }
    return progressRecord;
  }

  // Update user progress for a product
  async updateProgress(userId: string, productId: string, data: any) {
    // Upsert progress in DB
    const { progress: progressValue } = data;
    // Try to update first
    const updated = await db
      .update(progressTable)
      .set({
        progress: String(progressValue),
        updated_at: new Date().toISOString(),
      })
      .where(
        progressTable.user_id
          .eq(userId)
          .and(progressTable.product_id.eq(productId))
      )
      .returning();
    let progressRecord;
    if (updated.length > 0) {
      progressRecord = updated[0];
    } else {
      // Insert if not exists
      [progressRecord] = await db
        .insert(progressTable)
        .values({
          user_id: userId,
          product_id: productId,
          progress: String(progressValue),
        })
        .returning();
    }
    const cacheKey = `progress:${userId}:${productId}`;
    await setCache(cacheKey, progressRecord, 3600);
    // Cast progress to number for API response
    progressRecord.progress = Number(progressRecord.progress);
    return progressRecord;
  }
}
