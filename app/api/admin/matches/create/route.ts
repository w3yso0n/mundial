import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const torneoId = String(form.get("torneoId") ?? "");
  const fase = String(form.get("fase") ?? "").trim();
  const grupoRaw = String(form.get("grupo") ?? "").trim();
  const localId = String(form.get("localId") ?? "");
  const visitanteId = String(form.get("visitanteId") ?? "");
  const fechaRaw = String(form.get("fecha") ?? "").trim();
  const estadioRaw = String(form.get("estadio") ?? "").trim();
  const ordenRaw = String(form.get("orden") ?? "").trim();

  if (!torneoId) return NextResponse.json({ error: "torneoId requerido" }, { status: 400 });
  if (!fase) return NextResponse.json({ error: "fase requerida" }, { status: 400 });
  if (!localId || !visitanteId) return NextResponse.json({ error: "localId/visitanteId requerido" }, { status: 400 });
  if (localId === visitanteId) return NextResponse.json({ error: "local y visitante no pueden ser iguales" }, { status: 400 });

  const fecha = new Date(fechaRaw);
  if (Number.isNaN(fecha.getTime())) return NextResponse.json({ error: "fecha inválida" }, { status: 400 });

  const orden = ordenRaw === "" ? null : Number(ordenRaw);
  if (ordenRaw !== "" && (!Number.isInteger(orden) || (orden as number) <= 0)) {
    return NextResponse.json({ error: "orden inválido" }, { status: 400 });
  }

  const partido = await prisma.partido.create({
    data: {
      torneoId,
      fase,
      grupo: grupoRaw ? grupoRaw : null,
      orden: orden as number | null,
      localId,
      visitanteId,
      fecha,
      estadio: estadioRaw ? estadioRaw : null,
      estado: "pendiente",
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: partido.id });
}

