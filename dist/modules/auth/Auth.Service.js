"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const Drizzle_config_1 = require("../../db/Drizzle.config");
const platform_users_1 = require("../../db/platform_users");
const drizzle_orm_1 = require("drizzle-orm");
const jwt_1 = require("../../utils/jwt");
const registerUser = async (data) => {
    const { email, fullName, password, role, avatarUrl, learnworldsUser_ } = data;
    // ✅ Check for existing user
    const [existing] = await Drizzle_config_1.db
        .select()
        .from(platform_users_1.platformUsers)
        .where((0, drizzle_orm_1.eq)(platform_users_1.platformUsers.email, email));
    if (existing)
        throw new Error("User already exists");
    // ✅ Hash and insert
    const passwordHash = await (0, jwt_1.hashPassword)(password);
    await Drizzle_config_1.db.insert(platform_users_1.platformUsers).values({
        email,
        fullName,
        passwordHash,
        role,
        avatarUrl,
        learnworldsUser_,
    });
    // ✅ Fetch created user (without password)
    const [user] = await Drizzle_config_1.db
        .select({
        id: platform_users_1.platformUsers.id,
        email: platform_users_1.platformUsers.email,
        fullName: platform_users_1.platformUsers.fullName,
        role: platform_users_1.platformUsers.role,
        avatarUrl: platform_users_1.platformUsers.avatarUrl,
        learnworldsUser_: platform_users_1.platformUsers.learnworldsUser_,
        isActive: platform_users_1.platformUsers.isActive,
        createdAt: platform_users_1.platformUsers.createdAt,
    })
        .from(platform_users_1.platformUsers)
        .where((0, drizzle_orm_1.eq)(platform_users_1.platformUsers.email, email));
    const token = (0, jwt_1.signToken)({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    return { user, token };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const { email, password } = data;
    const [user] = await Drizzle_config_1.db
        .select()
        .from(platform_users_1.platformUsers)
        .where((0, drizzle_orm_1.eq)(platform_users_1.platformUsers.email, email));
    if (!user)
        throw new Error("Invalid email or password");
    const isMatch = await (0, jwt_1.comparePassword)(password, user.passwordHash);
    if (!isMatch)
        throw new Error("Invalid email or password");
    if (!user.isActive)
        throw new Error("Account is deactivated");
    if (user.isSuspended)
        throw new Error("Account is suspended");
    const token = (0, jwt_1.signToken)({
        id: user.id,
        email: user.email,
        role: user.role,
    });
    const { passwordHash, ...safeUser } = user;
    return { user: safeUser, token };
};
exports.loginUser = loginUser;
