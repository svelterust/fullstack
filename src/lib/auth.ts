import { db } from "$lib/database";
import { eq, getTableColumns } from "drizzle-orm";
import { sessionTable, userTable, type Session, type User } from "$lib/schema";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import type { Cookies } from "@sveltejs/kit";

// Helpers for passwords
const hashPassword = (password: string) => Bun.password.hash(password);
const verifyPassword = (password: string, hash: string) => Bun.password.verify(password, hash);

function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  return encodeBase32LowerCaseNoPadding(bytes);
}

async function generateSessionId(token: string): Promise<string> {
  const data = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return encodeHexLowerCase(new Uint8Array(hash));
}

async function createSession(token: string, userId: number, expiresAt?: Date): Promise<Session> {
  // Create session and insert into database
  const sessionId = await generateSessionId(token);
  const [session] = await db
    .insert(sessionTable)
    .values({
      id: sessionId,
      userId,
      expiresAt: expiresAt ? expiresAt : new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    })
    .returning();
  return session;
}

async function validateSessionToken(token: string, cookies: Cookies): Promise<SessionValidationResult> {
  // Check if session exists
  const sessionId = await generateSessionId(token);
  const { data, ...safeUserTable } = getTableColumns(userTable);
  const result = await db
    .select({ user: safeUserTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId));
  if (result.length < 1) return { session: null, user: null };
  const { user, session } = result[0];

  // If session has expired, delete it
  if (Date.now() >= session.expiresAt.getTime()) {
    await logout(sessionId, cookies);
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
    return { session: null, user: null };
  }

  // Extend session if it's recent
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 14) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 28);
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionTable.id, session.id));
  }
  return { session, user };
}

// Ways to authenticate
type Password = { password: string };
type Google = { googleId: string };
type Method = Password | Google;

function setSessionToken(token: string, expiresAt: Date, cookies: Cookies): void {
  cookies.set("session", token, { httpOnly: true, sameSite: "lax", expires: expiresAt, path: "/" });
}

function removeSessionToken(cookies: Cookies) {
  cookies.delete("session", { path: "/" });
}

function extractApiToken(headers: Headers): string | null {
  // Check if header exists
  const authorization = headers.get("Authorization");
  if (!authorization) return null;

  // Try to get tokens
  const values = authorization.split(" ");
  if (values.length < 2 || values[0] != "Bearer") return null;
  return values[1];
}

export async function logout(sessionId: string, cookies: Cookies) {
  // Remove session from database
  removeSessionToken(cookies);
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function register(email: string, method: Method): Promise<void> {
  if ("password" in method) {
    const data = await hashPassword(method.password);
    await db.insert(userTable).values({ email, data, method: "password" });
  } else if ("googleId" in method) {
    await db.insert(userTable).values({ email, data: method.googleId, method: "google" });
  }
}

export async function login(email: string, method: Method, cookies: Cookies) {
  // Get user from database and verify
  const user = await db
    .select()
    .from(userTable)
    .where(eq(userTable.email, email))
    .then((users) => users[0]);
  if ("password" in method && !(await verifyPassword(method.password, user.data))) {
    throw new Error("E-mail or password is invalid");
  } else if ("googleId" in method && user.data != method.googleId) {
    throw new Error("E-mail or password is invalid");
  }

  // Create token and session
  const token = generateSessionToken();
  const session = await createSession(token, user.id);
  setSessionToken(token, session.expiresAt, cookies);
}

export async function getUserAndSession(cookies: Cookies, headers: Headers): Promise<SessionValidationResult> {
  // Check session cookie and authorization header
  const token = cookies.get("session") || extractApiToken(headers);
  if (!token) return { user: null, session: null };

  // Validate token
  const { user, session } = await validateSessionToken(token, cookies);
  if (user && session) {
    setSessionToken(token, session.expiresAt, cookies);
    return { user, session };
  } else {
    removeSessionToken(cookies);
  }
  return { user: null, session: null };
}

export async function generateApiToken(user_id: number): Promise<string> {
  const token = generateSessionToken();
  await createSession(token, user_id, new Date(8640000000000000));
  return token;
}

export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
