import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i];
  return out === 0;
}

function bytesToHex(bytes: Uint8Array) {
  let hex = "";
  for (const b of bytes) hex += b.toString(16).padStart(2, "0");
  return hex;
}

async function hmacSha256Hex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bytesToHex(new Uint8Array(sig));
}

async function isValidSession(value: string | undefined | null) {
  if (!value) return false;
  const [token, sig] = value.split(".");
  if (!token || !sig) return false;

  const secret = process.env.ADMIN_SESSION_SECRET ?? "dev-secret-change-me";
  const expected = await hmacSha256Hex(secret, token);

  const a = new TextEncoder().encode(sig);
  const b = new TextEncoder().encode(expected);
  return timingSafeEqual(a, b);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();
  if (pathname === "/api/admin/login") return NextResponse.next();

  const session = req.cookies.get(COOKIE_NAME)?.value;
  if (await isValidSession(session)) return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

