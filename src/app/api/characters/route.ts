import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { characters } from "~/server/db/schema";
import { verifyKey } from "~/server/key";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  try {
    const allCharacters = await db.select().from(characters);
    return Response.json({ characters: allCharacters }, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, type, power, description, imageUrl } = body;

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const [newCharacter] = await db
      .insert(characters)
      .values({
        name,
        type: type || "Character",
        power: power || "Unknown",
        description: description || "",
        imageUrl: imageUrl || "",
      })
      .returning();

    return Response.json({ character: newCharacter }, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}