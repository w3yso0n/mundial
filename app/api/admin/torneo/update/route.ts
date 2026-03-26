import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const form = await req.formData();
  const torneoId = String(form.get("torneoId") ?? "");
  const precioPaisBaseRaw = String(form.get("precioPaisBase") ?? "").trim();

  if (!torneoId) {
    return NextResponse.json({ error: "torneoId requerido" }, { status: 400 });
  }

  const precio =
    precioPaisBaseRaw === ""
      ? null
      : (() => {
          const n = Number(precioPaisBaseRaw);
          if (!Number.isFinite(n) || n < 0) return undefined;
          return new Prisma.Decimal(precioPaisBaseRaw);
        })();

  if (precio === undefined) {
    return NextResponse.json({ error: "precioPaisBase inválido" }, { status: 400 });
  }

  await prisma.torneo.update({
    where: { id: torneoId },
    data: { precioPaisBase: precio },
  });

  return NextResponse.json({ ok: true });
}

