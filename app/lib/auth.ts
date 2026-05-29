import { createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
} from "@/app/lib/auth-constants";
import { prisma } from "@/app/lib/prisma";

const SESSION_COOKIE = "bean_counter_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const PASSWORD_ITERATIONS = 120_000;
const PASSWORD_KEY_LENGTH = 32;
const PASSWORD_DIGEST = "sha256";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

type SessionPayload = {
  userId: number;
  exp: number;
};

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true },
  });

  return user;
});

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  return user;
}

export async function createSession(userId: number) {
  const cookieStore = await cookies();
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS;

  cookieStore.set(SESSION_COOKIE, signSessionToken({ userId, exp }), {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function ensureDefaultAdmin() {
  const userCount = await prisma.user.count();

  if (userCount > 0) return null;

  return prisma.user.create({
    data: {
      name: "Cafe Admin",
      email: DEFAULT_ADMIN_EMAIL,
      passwordHash: hashPassword(DEFAULT_ADMIN_PASSWORD),
      role: "ADMIN",
    },
  });
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("base64url");
  const hash = pbkdf2Sync(
    password,
    salt,
    PASSWORD_ITERATIONS,
    PASSWORD_KEY_LENGTH,
    PASSWORD_DIGEST,
  ).toString("base64url");

  return `pbkdf2$${PASSWORD_ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password: string, passwordHash: string | null) {
  if (!passwordHash) return false;

  const [scheme, iterationsRaw, salt, storedHash] = passwordHash.split("$");

  if (scheme !== "pbkdf2" || !iterationsRaw || !salt || !storedHash) {
    return false;
  }

  const iterations = Number(iterationsRaw);
  if (!Number.isInteger(iterations) || iterations < 1) return false;

  const candidate = pbkdf2Sync(
    password,
    salt,
    iterations,
    PASSWORD_KEY_LENGTH,
    PASSWORD_DIGEST,
  );
  const expected = Buffer.from(storedHash, "base64url");

  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}

function signSessionToken(payload: SessionPayload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", getSessionSecret())
    .update(body)
    .digest("base64url");

  return `${body}.${signature}`;
}

function verifySessionToken(value?: string) {
  if (!value) return null;

  const [body, signature] = value.split(".");
  if (!body || !signature) return null;

  const expectedSignature = createHmac("sha256", getSessionSecret())
    .update(body)
    .digest("base64url");
  const actual = Buffer.from(signature, "base64url");
  const expected = Buffer.from(expectedSignature, "base64url");

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));

    if (
      !payload ||
      !Number.isInteger(payload.userId) ||
      !Number.isInteger(payload.exp) ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload as SessionPayload;
  } catch {
    return null;
  }
}

function getSessionSecret() {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXTAUTH_SECRET ??
    "development-only-change-this-secret"
  );
}
