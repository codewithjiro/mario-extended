import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { gameItems } from "~/server/db/schema";
import { verifyKey } from "~/server/key";
import { ratelimiter } from "~/server/ratelimit";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  const { success, remaining, limit, reset } = await ratelimiter.limit(apiKey);
  if (!success) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(
          Math.max(1, Math.ceil((+reset - Date.now()) / 1000)),
        ),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, remaining)),
      },
    });
  }

  const allItems = await db.select().from(gameItems);

  return Response.json(
    {
      ok: true,
      message: "API connected successfully!",
      keyId: result.keyId,
      items: allItems,
    },
    {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, remaining)),
      },
    },
  );
}
