import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const participanteId = String(form.get("participanteId") ?? "");
  const paisId = String(form.get("paisId") ?? "");

  if (!participanteId) return NextResponse.json({ error: "participanteId requerido" }, { status: 400 });
  if (!paisId) return NextResponse.json({ error: "paisId requerido" }, { status: 400 });

  const [participante, pais] = await Promise.all([
    prisma.participante.findUnique({ where: { id: participanteId }, select: { id: true, torneoId: true } }),
    prisma.pais.findUnique({ where: { id: paisId }, select: { id: true, torneoId: true } }),
  ]);

  if (!participante) return NextResponse.json({ error: "participante no encontrado" }, { status: 404 });
  if (!pais) return NextResponse.json({ error: "pais no encontrado" }, { status: 404 });
  if (participante.torneoId !== pais.torneoId) {
    return NextResponse.json({ error: "torneo mismatch" }, { status: 400 });
  }

  const existingForPais = await prisma.paisAsignacion.findFirst({
    where: { paisId },
    select: { id: true, participanteId: true },
  });
  if (existingForPais && existingForPais.participanteId !== participanteId) {
    return NextResponse.json({ error: "pais ya asignado" }, { status: 409 });
  }
  if (existingForPais) return NextResponse.json({ ok: true, id: existingForPais.id });

  const asignacion = await prisma.paisAsignacion.create({
    data: { participanteId, paisId },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: asignacion.id });
}

