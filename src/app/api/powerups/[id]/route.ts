import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { powerups } from "~/server/db/schema";
import { verifyKey } from "~/server/key";
import { eq } from "drizzle-orm";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, effect, rarity, description, imageUrl, type } = body;
    const id = parseInt(params.id);

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const [updatedPowerup] = await db
      .update(powerups)
      .set({
        name,
        effect,
        rarity,
        description,
        imageUrl,
        type,
      })
      .where(eq(powerups.id, id))
      .returning();

    if (!updatedPowerup) {
      return Response.json({ error: "Power-up not found" }, { status: 404 });
    }

    return Response.json({ powerup: updatedPowerup }, { status: 200 });
  } catch (error: any) {
    console.error("Update error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  try {
    const id = parseInt(params.id);
    const [deletedPowerup] = await db
      .delete(powerups)
      .where(eq(powerups.id, id))
      .returning();

    if (!deletedPowerup) {
      return Response.json({ error: "Power-up not found" }, { status: 404 });
    }

    return Response.json({ powerup: deletedPowerup }, { status: 200 });
  } catch (error: any) {
    console.error("Delete error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}