import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { gameItems } from "~/server/db/schema";

// ✅ UPDATE game item
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const {
      name,
      category,
      type,
      power,
      effect,
      rarity,
      description,
      imageUrl,
    } = body;

    // Basic validation
    if (
      !name &&
      !category &&
      !type &&
      !power &&
      !effect &&
      !rarity &&
      !description &&
      !imageUrl
    ) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 },
      );
    }

    await db
      .update(gameItems)
      .set({
        ...(name && { name }),
        ...(category && { category }),
        ...(type && { type }),
        ...(power && { power }),
        ...(effect && { effect }),
        ...(rarity && { rarity }),
        ...(description && { description }),
        ...(imageUrl && { imageUrl }),
        updatedAt: new Date(), // auto-update timestamp
      })
      .where(eq(gameItems.id, Number(params.id)));

    return NextResponse.json({ message: "Game item updated successfully" });
  } catch (error: any) {
    console.error("Error updating game item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE game item
export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    await db.delete(gameItems).where(eq(gameItems.id, Number(params.id)));
    return NextResponse.json({ message: "Game item deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting game item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
