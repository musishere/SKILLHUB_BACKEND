"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.schema = void 0;
const node_postgres_1 = require("drizzle-orm/node-postgres");
const pg_1 = require("pg");
const Logger_1 = require("../utils/Logger");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 👇 Import your schemas
const Roles_Schema_1 = require("../modules/roles/Roles.Schema");
// ✅ Define schema for IDE autocomplete and Drizzle migration tools (optional but useful)
exports.schema = {
    roles: Roles_Schema_1.roles,
    permissions: Roles_Schema_1.permissions,
    rolePermissions: Roles_Schema_1.rolePermissions,
};
const pool = new pg_1.Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    ssl: {
        rejectUnauthorized: false, // Required by Supabase
    },
});
exports.db = (0, node_postgres_1.drizzle)(pool, { schema: exports.schema }); // 👈 Pass schema here
pool
    .connect()
    .then(() => Logger_1.logger.info("🐘 Drizzle PostgreSQL connected successfully."))
    .catch((err) => {
    Logger_1.logger.error("🔴 PostgreSQL connection failed:", err);
    process.exit(1);
});
