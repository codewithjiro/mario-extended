import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { characters, powerups } from "~/server/db/schema";
import { verifyKey } from "~/server/key";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  const allCharacters = await db.select().from(characters);
  const allPowerups = await db.select().from(powerups);

  return Response.json(
    {
      ok: true,
      message: "API connected successfully!",
      keyId: result.keyId,
      characters: allCharacters,
      powerups: allPowerups,
    },
    { status: 200 },
  );
}
