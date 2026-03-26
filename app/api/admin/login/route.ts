import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";

function safeEqual(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  const expectedEmail = process.env.ADMIN_EMAIL ?? "admin@demo.com";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "12345678";

  if (!safeEqual(email, expectedEmail) || !safeEqual(password, expectedPassword)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url), 303);
  }

  const token = crypto.randomBytes(32).toString("hex");
  const secret = process.env.ADMIN_SESSION_SECRET ?? "dev-secret-change-me";
  const sig = crypto.createHmac("sha256", secret).update(token).digest("hex");
  const value = `${token}.${sig}`;

  const jar = await cookies();
  jar.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });

  return NextResponse.redirect(new URL("/admin", req.url), 303);
}

