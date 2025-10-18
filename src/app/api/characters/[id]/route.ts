
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { characters } from "~/server/db/schema";

// UPDATE character
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    await db
      .update(characters)
      .set({
        name: body.name,
        type: body.type,
        power: body.power,
        description: body.description,
        imageUrl: body.imageUrl,
      })
      .where(eq(characters.id, Number(params.id)));

    return NextResponse.json({ message: "Character updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE character
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await db.delete(characters).where(eq(characters.id, Number(params.id)));
    return NextResponse.json({ message: "Character deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
