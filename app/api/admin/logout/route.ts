import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const jar = await cookies();
  jar.set("admin_session", "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
  return NextResponse.redirect(new URL("/admin/login", req.url), 303);
}

