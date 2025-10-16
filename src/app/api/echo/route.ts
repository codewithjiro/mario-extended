import { NextRequest } from "next/server";
import { ilike } from "drizzle-orm";
import { db } from "~/server/db";
import { characters } from "~/server/db/schema";
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
      { error: "Invalid request body. input is required." },
      { status: 400 },
    );
  }

  try {
    const getCharacter = await db
      .select({
        id: characters.id,
        name: characters.name,
        type: characters.type,
        power: characters.power,
        description: characters.description,
        imageUrl: characters.imageUrl,
      })
      .from(characters)
      .where(ilike(characters.name, `%${body.postBody}%`));

    if (getCharacter.length === 0) {
      return Response.json(
        { error: "No character found with the given name." },
        { status: 404 },
      );
    }

    return Response.json(
      {
        ok: true,
        message: "Character found successfully.",
        character: getCharacter[0],
        keyId: result.keyId,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return Response.json(
      { error: error.message ?? "Failed to fetch character." },
      { status: 500 },
    );
  }
}
