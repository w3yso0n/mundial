import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

function parseNullableInt(v: string) {
  const t = v.trim();
  if (t === "") return null;
  const n = Number(t);
  if (!Number.isInteger(n) || n < 0) return undefined;
  return n;
}

export async function POST(req: Request) {
  const form = await req.formData();
  const partidoId = String(form.get("partidoId") ?? "");
  const estado = String(form.get("estado") ?? "pendiente").trim();
  const ganadorIdRaw = String(form.get("ganadorId") ?? "").trim();
  const golesLocalRaw = String(form.get("golesLocal") ?? "");
  const golesVisitanteRaw = String(form.get("golesVisitante") ?? "");

  if (!partidoId) return NextResponse.json({ error: "partidoId requerido" }, { status: 400 });
  if (!["pendiente", "jugado", "cancelado"].includes(estado)) {
    return NextResponse.json({ error: "estado inválido" }, { status: 400 });
  }

  const golesLocal = parseNullableInt(golesLocalRaw);
  const golesVisitante = parseNullableInt(golesVisitanteRaw);
  if (golesLocal === undefined || golesVisitante === undefined) {
    return NextResponse.json({ error: "goles inválidos" }, { status: 400 });
  }

  const match = await prisma.partido.findUnique({
    where: { id: partidoId },
    select: { localId: true, visitanteId: true },
  });
  if (!match) return NextResponse.json({ error: "partido no encontrado" }, { status: 404 });

  const ganadorId = ganadorIdRaw === "" ? null : ganadorIdRaw;
  if (ganadorId && ganadorId !== match.localId && ganadorId !== match.visitanteId) {
    return NextResponse.json({ error: "ganador inválido" }, { status: 400 });
  }

  await prisma.partido.update({
    where: { id: partidoId },
    data: {
      estado,
      ganadorId,
      golesLocal,
      golesVisitante,
    },
  });

  return NextResponse.json({ ok: true });
}

