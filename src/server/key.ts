import { createHash, randomBytes } from "crypto";
import { apiKeys } from "./db/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

const KEY_PREFIX = process.env.KEY_PREFIX ?? "sk_live_";

export function generatePlainKey(bytes: number = 24) {
  const raw = randomBytes(bytes).toString("base64url");
  const key = `${KEY_PREFIX}${raw}`;
  const last4 = key.slice(-4);
  return { key, last4 };
}

export function sha256(data: string) {
  return createHash("sha256").update(data).digest("hex");
}

export async function insertKey(name: string) {
  const session = await auth();
  if (!session.userId) {
    throw new Error("Unauthorized: No user logged in");
  }

  const userId = session.userId;

  const { key, last4 } = generatePlainKey();
  const hashed = sha256(key);
  const id = crypto.randomUUID();

  await db.insert(apiKeys).values({
    id,
    userId,
    name,
    hashedKey: hashed,
    last4,
  });

  return { id, name, key, last4 } as const;
}

export async function listKeys() {
  return db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt));
}

export async function revokeKey(id: string) {
  const res = await db
    .update(apiKeys)
    .set({ revoked: true })
    .where(eq(apiKeys.id, id));
  return (res.rowCount ?? 0) > 0;
}

export async function verifyKey(apiKey: string) {
  const hashed = sha256(apiKey);
  const rows = await db
    .select({ id: apiKeys.id, revoked: apiKeys.revoked })
    .from(apiKeys)
    .where(eq(apiKeys.hashedKey, hashed));
  const row = rows[0];
  if (!row) return { valid: false, reason: "not_found" } as const;
  if (row.revoked) return { valid: false as const, reason: "revoked" } as const;
  return { valid: true, keyId: row.id } as const;
}
