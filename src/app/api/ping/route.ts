import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { gameItems } from "~/server/db/schema";
import { verifyKey } from "~/server/key";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  const allItems = await db.select().from(gameItems);

  return Response.json(
    {
      ok: true,
      message: "API connected successfully!",
      keyId: result.keyId,
      items: allItems,
    },
    { status: 200 },
  );
}
