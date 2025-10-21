import { NextRequest } from "next/server";
import { ilike } from "drizzle-orm";
import { db } from "~/server/db";
import { verifyKey } from "~/server/key";
import { gameItems } from "~/server/db/schema";
import { ratelimiter } from "~/server/ratelimit";

export async function POST(req: NextRequest) {
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

  const body = await req.json();

  if (!body || !body.postBody) {
    return Response.json(
      { error: "Invalid request body. 'postBody' is required." },
      { status: 400 },
    );
  }

  try {
    const foundItems = await db
      .select()
      .from(gameItems)
      .where(ilike(gameItems.name, `%${body.postBody}%`));

    if (foundItems.length === 0) {
      return Response.json(
        { error: "No results found." },
        {
          status: 404,
          headers: {
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(Math.max(0, remaining)),
          },
        },
      );
    }

    return Response.json(
      {
        ok: true,
        message: "Search completed successfully.",
        keyId: result.keyId,
        items: foundItems,
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(Math.max(0, remaining)),
        },
      },
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message ?? "Failed to process search." },
      { status: 500 },
    );
  }
}

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
