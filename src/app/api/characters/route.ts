
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { characters } from "~/server/db/schema";

// GET all characters
export async function GET() {
  try {
    const result = await db.select().from(characters).orderBy(characters.id);
    return NextResponse.json({ characters: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST (add new character)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await db.insert(characters).values({
      name: body.name,
      type: body.type,
      power: body.power,
      description: body.description,
      imageUrl: body.imageUrl,
    });
    return NextResponse.json({ message: "Character added successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
