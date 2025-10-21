import { NextRequest, NextResponse } from "next/server";

const raw = process.env.ALLOWED_ORIGINS?.trim();
const allowedOrigins = raw
  ? new Set(raw.split(",").map((origin) => origin.trim()))
  : null;

const DEFAULT_METHODS = ["GET", "POST", "OPTIONS"].join(", ");
const DEFAULT_HEADERS = ["Content-Type", "x-api-key", "Authorization"].join(
  ", ",
);

function decideOrigin(origin: string | null) {
  if (!origin) return null;
  if (!allowedOrigins) return null;
  return allowedOrigins.has(origin) ? origin : null;
}

function withCors(req: NextRequest, res: Response) {
  const origin = req.headers.get("origin");
  const allowOrigins = decideOrigin(origin);

  if (allowedOrigins && origin && !allowedOrigins) {
    return new NextResponse(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (allowOrigins) {
    res.headers.set("Access-Control-Allow-Origin", allowOrigins);
    res.headers.set("Vary", "Origin");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Headers", DEFAULT_HEADERS);
    res.headers.set("Access-Control-Allow-Methods", DEFAULT_METHODS);
    res.headers.set("Access-Control-Max-Age", "600");

    res.headers.set(
      "Access-Control-Expose-Headers",
      ["Retry-After", "X-RateLimit-Limit", "X-RateLimit-Remaining"].join(", "),
    );
  }

  return res;
}

export function middleware(req: NextRequest) {
  if (req.method === "OPTIONS") {
    const res = new Response(null, { status: 204 });
    return withCors(req, res);
  }

  const res = NextResponse.next();
  return withCors(req, res);
}

export const config = {
  matcher: "/api/:path*",
};
