
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { powerups } from "~/server/db/schema";

// UPDATE
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();

    await db
      .update(powerups)
      .set({
        name: body.name,
        effect: body.effect,
        rarity: body.rarity,
        description: body.description,
        imageUrl: body.imageUrl,
        type: body.type,
      })
      .where(eq(powerups.id, Number(params.id)));

    return NextResponse.json({ message: "Power-up updated successfully!" });
  } catch (error: any) {
    console.error("Error updating powerup:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.delete(powerups).where(eq(powerups.id, Number(params.id)));
    return NextResponse.json({ message: "Power-up deleted successfully!" });
  } catch (error: any) {
    console.error("Error deleting powerup:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
