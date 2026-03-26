import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const partidoId = String(form.get("partidoId") ?? "");
  if (!partidoId) return NextResponse.json({ error: "partidoId requerido" }, { status: 400 });

  await prisma.partido.delete({ where: { id: partidoId } });
  return NextResponse.json({ ok: true });
}

