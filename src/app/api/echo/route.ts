import { NextRequest } from "next/server";
import { ilike } from "drizzle-orm";
import { db } from "~/server/db";
import { characters, powerups } from "~/server/db/schema";
import { verifyKey } from "~/server/key";

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
    const foundCharacters = await db
      .select()
      .from(characters)
      .where(ilike(characters.name, `%${body.postBody}%`));

    const foundPowerups = await db
      .select()
      .from(powerups)
      .where(ilike(powerups.name, `%${body.postBody}%`));

    if (foundCharacters.length === 0 && foundPowerups.length === 0) {
      return Response.json(
        { error: "No results found in either table." },
        { status: 404 },
      );
    }

    return Response.json(
      {
        ok: true,
        message: "Search completed successfully.",
        keyId: result.keyId,
        characters: foundCharacters,
        powerups: foundPowerups,
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
