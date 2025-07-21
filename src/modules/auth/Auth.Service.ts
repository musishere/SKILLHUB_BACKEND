/**
 * Auth service: handles user registration, login, and related logic.
 */
import { db } from "../../db/Drizzle.config";
import { platformUsers } from "../../db/platform_users";
import { eq } from "drizzle-orm";
import { hashPassword, comparePassword, signToken } from "../../utils/jwt";
import { logger } from "../../utils/Logger";

interface RegisterInput {
  email: string;
  fullName: string;
  password: string;
  role: "instructor" | "student" | "admin";
  avatarUrl?: string;
  learnworldsUser_?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

/**
 * Registers a new user and returns the user and JWT token.
 */
export const registerUser = async (data: RegisterInput) => {
  debugger;
  const { email, fullName, password, role, avatarUrl, learnworldsUser_ } = data;

  // ✅ Check for existing user
  const [existing] = await db
    .select()
    .from(platformUsers)
    .where(eq(platformUsers.email, email));

  if (existing) throw new Error("User already exists");

  // ✅ Hash and insert
  const passwordHash = await hashPassword(password);

  await db.insert(platformUsers).values({
    email,
    fullName,
    passwordHash,
    role,
    avatarUrl,
    learnworldsUser_,
  });

  // ✅ Fetch created user (without password)
  const [user] = await db
    .select({
      id: platformUsers.id,
      email: platformUsers.email,
      fullName: platformUsers.fullName,
      role: platformUsers.role,
      avatarUrl: platformUsers.avatarUrl,
      learnworldsUser_: platformUsers.learnworldsUser_,
      isActive: platformUsers.isActive,
      createdAt: platformUsers.createdAt,
    })
    .from(platformUsers)
    .where(eq(platformUsers.email, email));

  // ✅ Sign token with strict role typing
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role as "instructor" | "student" | "admin",
  });

  return { user, token };
};

/**
 * Logs in a user and returns the user and JWT token.
 */
export const loginUser = async (data: LoginInput) => {
  const { email, password } = data;

  const [user] = await db
    .select()
    .from(platformUsers)
    .where(eq(platformUsers.email, email));

  if (!user) throw new Error("Invalid email or password");

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) throw new Error("Invalid email or password");

  if (!user.isActive) throw new Error("Account is deactivated");
  if (user.isSuspended) throw new Error("Account is suspended");

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role as "instructor" | "student" | "admin",
  });

  const { passwordHash, ...safeUser } = user;

  return { user: safeUser, token };
};
