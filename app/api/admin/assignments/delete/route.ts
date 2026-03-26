import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const asignacionId = String(form.get("asignacionId") ?? "");
  if (!asignacionId) return NextResponse.json({ error: "asignacionId requerido" }, { status: 400 });

  await prisma.paisAsignacion.delete({ where: { id: asignacionId } });
  return NextResponse.json({ ok: true });
}

