// Team Plan Member Service
// Handles team plan member business logic
import {
  db,
  team_plan_members as teamPlanMembersTable,
} from "../../db/Drizzle.config";

export class TeamPlanMemberService {
  // Add a member to a team plan
  async addMember(teamPlanId: string, userId: string, role: string) {
    // Insert team plan member in DB
    const [member] = await db
      .insert(teamPlanMembersTable)
      .values({
        team_plan_id: teamPlanId,
        user_id: userId,
        role,
      })
      .returning();
    return member;
  }

  // List members of a team plan
  async listMembers(teamPlanId: string) {
    // Fetch from DB
    const members = await db
      .select()
      .from(teamPlanMembersTable)
      .where(teamPlanMembersTable.team_plan_id.eq(teamPlanId));
    return members;
  }
}
