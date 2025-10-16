import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { characters } from "~/server/db/schema";
import { verifyKey } from "~/server/key";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);


  // Check if the API key is valid
  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

    // Fetch all data from the table
  const allData = await db.select().from(characters);

  return Response.json(
    { ok: true, message: "Hello GET", keyId: result.keyId, data: allData },
    { status: 200 },
  );
}
