import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const participanteId = String(form.get("participanteId") ?? "");
  if (!participanteId) return NextResponse.json({ error: "participanteId requerido" }, { status: 400 });

  await prisma.participante.delete({ where: { id: participanteId } });
  return NextResponse.json({ ok: true });
}

