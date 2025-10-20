import { NextRequest } from "next/server";
import { ilike } from "drizzle-orm";
import { db } from "~/server/db";
import { verifyKey } from "~/server/key";
import { gameItems } from "~/server/db/schema";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
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
        { status: 404 },
      );
    }

    return Response.json(
      {
        ok: true,
        message: "Search completed successfully.",
        keyId: result.keyId,
        items: foundItems,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message ?? "Failed to process search." },
      { status: 500 },
    );
  }
}
