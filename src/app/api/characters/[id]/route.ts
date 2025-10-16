import { NextRequest } from "next/server";
import { db } from "~/server/db";
import { characters } from "~/server/db/schema";
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
    const { name, type, power, description, imageUrl } = body;
    const id = parseInt(params.id);

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const [updatedCharacter] = await db
      .update(characters)
      .set({
        name,
        type,
        power,
        description,
        imageUrl,
      })
      .where(eq(characters.id, id))
      .returning();

    if (!updatedCharacter) {
      return Response.json({ error: "Character not found" }, { status: 404 });
    }

    return Response.json({ character: updatedCharacter }, { status: 200 });
  } catch (error: any) {
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
    const [deletedCharacter] = await db
      .delete(characters)
      .where(eq(characters.id, id))
      .returning();

    if (!deletedCharacter) {
      return Response.json({ error: "Character not found" }, { status: 404 });
    }

    return Response.json({ character: deletedCharacter }, { status: 200 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}