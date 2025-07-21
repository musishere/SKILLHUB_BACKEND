// Review Service
// Handles review business logic
import { db, reviews as reviewsTable } from "../../db/Drizzle.config";

export class ReviewService {
  // Submit a review
  async submitReview(userId: string, data: any) {
    // Insert review in DB
    const { product_id, rating, content } = data;
    const [review] = await db
      .insert(reviewsTable)
      .values({
        user_id: userId,
        product_id,
        rating: String(rating),
        content,
      })
      .returning();
    // Cast rating to number for API response
    review.rating = Number(review.rating);
    return review;
  }

  // List reviews for a product
  async listReviews(productId: string) {
    // Fetch from DB
    let reviews = await db
      .select()
      .from(reviewsTable)
      .where(reviewsTable.product_id.eq(productId));
    // Cast rating to number for API response
    reviews = reviews.map((r) => ({ ...r, rating: Number(r.rating) }));
    return reviews;
  }
}
