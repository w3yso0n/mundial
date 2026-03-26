import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const torneoId = String(form.get("torneoId") ?? "");
  const nombre = String(form.get("nombre") ?? "").trim();
  const apodoRaw = String(form.get("apodo") ?? "").trim();
  const colorHexRaw = String(form.get("colorHex") ?? "").trim();

  if (!torneoId) return NextResponse.json({ error: "torneoId requerido" }, { status: 400 });
  if (!nombre) return NextResponse.json({ error: "nombre requerido" }, { status: 400 });

  const apodo = apodoRaw ? apodoRaw : null;
  const colorHex = colorHexRaw ? colorHexRaw : null;

  const p = await prisma.participante.create({
    data: {
      torneoId,
      nombre,
      apodo,
      colorHex,
      saldo: 0,
    },
    select: { id: true },
  });

  return NextResponse.json({ ok: true, id: p.id });
}

