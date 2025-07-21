// Enrollment Service
// Handles enrollment management business logic
import { setCache, getCache } from "../../utils/redisClient";
import { publishToQueue } from "../../utils/rabbitmqClient";
import { db, enrollments } from "../../db/Drizzle.config";

export class EnrollmentService {
  // Enroll user in product, cache status, and publish event
  async enroll(userId: string, productId: string) {
    // Insert enrollment in DB
    const [enrollment] = await db
      .insert(enrollments)
      .values({
        user_id: userId,
        product_id: productId,
        status: "ENROLLED",
      })
      .returning();
    const cacheKey = `enrollment:${userId}:${productId}`;
    await setCache(cacheKey, enrollment, 3600);
    // Publish event
    await publishToQueue("enrollment_events", {
      type: "enrolled",
      userId,
      productId,
    });
    return enrollment;
  }

  // Get enrollment status, using Redis cache
  async getEnrollment(userId: string, productId: string) {
    const cacheKey = `enrollment:${userId}:${productId}`;
    let enrollment = await getCache(cacheKey);
    if (!enrollment) {
      // Fetch from DB
      [enrollment] = await db
        .select()
        .from(enrollments)
        .where(
          enrollments.user_id
            .eq(userId)
            .and(enrollments.product_id.eq(productId))
        );
      if (enrollment) {
        await setCache(cacheKey, enrollment, 3600);
      }
    }
    return enrollment;
  }
}
