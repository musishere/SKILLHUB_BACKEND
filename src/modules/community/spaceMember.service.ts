// Space Member Service
// Handles space member business logic
import {
  db,
  space_members as spaceMembersTable,
} from "../../db/Drizzle.config";

export class SpaceMemberService {
  // Join a space
  async joinSpace(userId: string, spaceId: string) {
    // Insert space member in DB
    const [spaceMember] = await db
      .insert(spaceMembersTable)
      .values({
        space_id: spaceId,
        user_id: userId,
        status: "JOINED",
      })
      .returning();
    return spaceMember;
  }

  // List members in a space
  async listMembers(spaceId: string) {
    // Fetch from DB
    const members = await db
      .select()
      .from(spaceMembersTable)
      .where(spaceMembersTable.space_id.eq(spaceId));
    return members;
  }
}
