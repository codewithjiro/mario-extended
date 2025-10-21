import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { gameItems } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";

// ✅ GET — Fetch all game items
export async function GET() {
  try {
    const result = await db.select().from(gameItems).orderBy(gameItems.id);
    return NextResponse.json({ items: result });
  } catch (error: any) {
    console.error("Error fetching game items:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ POST — Add new game item (with real user ID)
export async function POST(req: Request) {
  try {
    // ✅ Await Clerk's auth() — it’s async
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // ✅ Basic validation
    if (!name || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, category" },
        { status: 400 },
      );
    }

    // ✅ Insert into DB with current userId
    await db.insert(gameItems).values({
      name,
      category,
      type,
      power: power ?? null,
      effect: effect ?? null,
      rarity,
      description: description ?? null,
      imageUrl: imageUrl ?? null,
      userId,
    });

    return NextResponse.json({ message: "Item added successfully" });
  } catch (error: any) {
    console.error("Error adding item:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
