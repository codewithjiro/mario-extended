import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { powerups } from "~/server/db/schema";
import { verifyKey } from "~/server/key";


export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  try {
    const allPowerups = await db.select().from(powerups);
    return Response.json({ powerups: allPowerups }, { status: 200 });
  } catch (error: any) {
    console.error("Database error:", error);
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
    const { name, effect, rarity, description, imageUrl, type } = body;

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const [newPowerup] = await db
      .insert(powerups)
      .values({
        name,
        effect: effect || "Unknown",
        rarity: rarity || "Common",
        description: description || "",
        imageUrl: imageUrl || "",
        type: type || "Power-up",
      })
      .returning();

    return Response.json({ powerup: newPowerup }, { status: 201 });
  } catch (error: any) {
    console.error("Create error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}