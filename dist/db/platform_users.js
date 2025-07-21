"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.platformUsers = void 0;
// db/schema/platformUsers.ts
const pg_core_1 = require("drizzle-orm/pg-core");
exports.platformUsers = (0, pg_core_1.pgTable)("platform_users", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
    fullName: (0, pg_core_1.varchar)("full_name", { length: 255 }).notNull(),
    passwordHash: (0, pg_core_1.varchar)("password_hash", { length: 255 }).notNull(),
    avatarUrl: (0, pg_core_1.varchar)("avatar_url", { length: 255 }),
    role: (0, pg_core_1.varchar)("role", { length: 100 }).notNull(),
    learnworldsUser_: (0, pg_core_1.varchar)("learnworlds_user_"), // ✅ underscore included
    isActive: (0, pg_core_1.boolean)("is_active").default(true),
    isSuspended: (0, pg_core_1.boolean)("is_suspended").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at", { mode: "string" }).defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { mode: "string" }).defaultNow(),
});
