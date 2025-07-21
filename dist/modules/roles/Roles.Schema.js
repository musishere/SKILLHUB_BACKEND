"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolePermissions = exports.permissions = exports.roles = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
// Roles Table
exports.roles = (0, pg_core_1.pgTable)("roles", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull().unique(),
    description: (0, pg_core_1.text)("description"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Permissions Table
exports.permissions = (0, pg_core_1.pgTable)("permissions", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    action: (0, pg_core_1.varchar)("action", { length: 100 }).notNull(),
    description: (0, pg_core_1.text)("description"),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
});
// Role-Permissions Join Table
exports.rolePermissions = (0, pg_core_1.pgTable)("role_permissions", {
    id: (0, pg_core_1.uuid)("id").primaryKey().defaultRandom(),
    roleId: (0, pg_core_1.uuid)("role_id").references(() => exports.roles.id, { onDelete: "cascade" }),
    permissionId: (0, pg_core_1.uuid)("permission_id").references(() => exports.permissions.id, {
        onDelete: "cascade",
    }),
});
