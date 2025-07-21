// Community Post Service
// Handles community post business logic
import {
  db,
  community_posts as communityPostsTable,
} from "../../db/Drizzle.config";

export class CommunityPostService {
  // Create a community post
  async createPost(userId: string, data: any) {
    // Insert post in DB
    const { space_id, content } = data;
    const [post] = await db
      .insert(communityPostsTable)
      .values({
        user_id: userId,
        space_id,
        content,
      })
      .returning();
    return post;
  }

  // List posts in a space
  async listPosts(spaceId: string) {
    // Fetch from DB
    const posts = await db
      .select()
      .from(communityPostsTable)
      .where(communityPostsTable.space_id.eq(spaceId));
    return posts;
  }
}
