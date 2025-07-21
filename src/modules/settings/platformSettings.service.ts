// Platform Settings Service
// Handles platform settings business logic
import {
  db,
  platform_settings as platformSettingsTable,
} from "../../db/Drizzle.config";

export class PlatformSettingsService {
  // Get platform settings
  async getSettings() {
    // Fetch from DB
    const settings = await db.select().from(platformSettingsTable);
    return settings;
  }

  // Update platform settings
  async updateSettings(data: any) {
    // Update in DB
    const { key, value } = data;
    const [updated] = await db
      .update(platformSettingsTable)
      .set({ value, updated_at: new Date().toISOString() })
      .where(platformSettingsTable.key.eq(key))
      .returning();
    return updated;
  }
}
