import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { powerups } from "~/server/db/schema";

// GET all powerups
export async function GET() {
  try {
    const result = await db.select().from(powerups).orderBy(powerups.id);
    return NextResponse.json({ powerups: result });
  } catch (error: any) {
    console.error("Error loading powerups:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST (add new powerup)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await db.insert(powerups).values({
      name: body.name,
      effect: body.effect,
      rarity: body.rarity,
      description: body.description,
      imageUrl: body.imageUrl,
      type: body.type,
    });
    return NextResponse.json({ message: "Power-up added successfully!" });
  } catch (error: any) {
    console.error("Error adding powerup:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
