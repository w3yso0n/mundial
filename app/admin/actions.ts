"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ========== Duelos automáticos ==========

async function generateDuelsForMatch(matchId: string) {
  const match = await prisma.partido.findUnique({
    where: { id: matchId },
  });
  if (!match) return;

  // Evitar duplicados
  const existing = await prisma.duelo.findFirst({
    where: { partidoId: match.id },
  });
  if (existing) return;

  const homeOwner = await prisma.paisAsignacion.findFirst({
    where: { paisId: match.localId },
  });
  const awayOwner = await prisma.paisAsignacion.findFirst({
    where: { paisId: match.visitanteId },
  });

  if (!homeOwner || !awayOwner) return;
  if (homeOwner.participanteId === awayOwner.participanteId) return;

  const MONTO_BASE = 100;

  await prisma.duelo.create({
    data: {
      torneoId: match.torneoId,
      partidoId: match.id,
      participanteAId: homeOwner.participanteId,
      participanteBId: awayOwner.participanteId,
      montoApostado: MONTO_BASE,
      estado: "pendiente",
    },
  });
}

async function resolveMatchAndCreateDebt(matchId: string) {
  const match = await prisma.partido.findUnique({
    where: { id: matchId },
  });
  if (!match) return;
  if (match.golesLocal == null || match.golesVisitante == null) return;

  const duelo = await prisma.duelo.findFirst({
    where: { partidoId: matchId },
  });
  if (!duelo) return;

  let winnerId: string | null = null;

  if (match.golesLocal > match.golesVisitante) {
    winnerId = duelo.participanteAId;
  } else if (match.golesVisitante > match.golesLocal) {
    winnerId = duelo.participanteBId;
  }

  const updatedDuelo = await prisma.duelo.update({
    where: { id: duelo.id },
    data: {
      ganadorId: winnerId,
      estado: winnerId ? "resuelto" : "empate",
    },
  });

  if (!winnerId) return;

  const loserId =
    winnerId === duelo.participanteAId
      ? duelo.participanteBId
      : duelo.participanteAId;

  // Crear deuda
  await prisma.deuda.create({
    data: {
      torneoId: match.torneoId,
      deudorId: loserId,
      acreedorId: winnerId,
      monto: updatedDuelo.montoApostado,
      razon: "Duelo automático del partido",
      referenciaId: updatedDuelo.id,
      tipoReferencia: "duelo",
      estado: "pendiente",
    },
  });

  // Actualizar saldo de participantes (opcional pero divertido)
  await prisma.participante.update({
    where: { id: winnerId },
    data: { saldo: { increment: updatedDuelo.montoApostado } },
  });
  await prisma.participante.update({
    where: { id: loserId },
    data: { saldo: { decrement: updatedDuelo.montoApostado } },
  });
}

// Server Actions para usar desde el panel de admin

export async function generarDueloParaPartido(formData: FormData) {
  const matchId = formData.get("matchId");
  if (typeof matchId !== "string") return;
  await generateDuelsForMatch(matchId);
  revalidatePath("/admin");
  revalidatePath("/duelos");
  revalidatePath("/calendario");
}

export async function resolverPartido(formData: FormData) {
  const matchId = formData.get("matchId");
  const golesLocal = formData.get("golesLocal");
  const golesVisitante = formData.get("golesVisitante");

  if (
    typeof matchId !== "string" ||
    typeof golesLocal !== "string" ||
    typeof golesVisitante !== "string"
  ) {
    return;
  }

  const gl = Number.parseInt(golesLocal, 10);
  const gv = Number.parseInt(golesVisitante, 10);
  if (Number.isNaN(gl) || Number.isNaN(gv)) return;

  await prisma.partido.update({
    where: { id: matchId },
    data: {
      golesLocal: gl,
      golesVisitante: gv,
      estado: "jugado",
    },
  });

  await resolveMatchAndCreateDebt(matchId);

  revalidatePath("/admin");
  revalidatePath("/duelos");
  revalidatePath("/");
}

// ========== Gestión de participantes / países / precio ==========

export async function actualizarPrecioPais(formData: FormData) {
  const torneoId = formData.get("torneoId");
  const precio = formData.get("precioPaisBase");
  if (typeof torneoId !== "string" || typeof precio !== "string") return;

  const valor = Number.parseFloat(precio.replace(",", "."));
  if (Number.isNaN(valor) || valor < 0) return;

  await prisma.torneo.update({
    where: { id: torneoId },
    data: { precioPaisBase: valor },
  });

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function crearParticipante(formData: FormData) {
  const torneoId = formData.get("torneoId");
  const nombre = formData.get("nombre");
  const apodo = formData.get("apodo");
  const colorHex = formData.get("colorHex");

  if (typeof torneoId !== "string" || typeof nombre !== "string" || !nombre.trim()) return;

  await prisma.participante.create({
    data: {
      torneoId,
      nombre: nombre.trim(),
      apodo: typeof apodo === "string" && apodo.trim() ? apodo.trim() : null,
      colorHex: typeof colorHex === "string" && colorHex.trim() ? colorHex.trim() : "#6366f1",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/participantes");
}

export async function asignarPaisAParticipante(formData: FormData) {
  const torneoId = formData.get("torneoId");
  const participanteId = formData.get("participanteId");
  const paisId = formData.get("paisId");

  if (
    typeof torneoId !== "string" ||
    typeof participanteId !== "string" ||
    typeof paisId !== "string"
  ) {
    return;
  }

  const torneo = await prisma.torneo.findUnique({
    where: { id: torneoId },
  });
  if (!torneo) return;

  // Crear asignación (si no existe)
  await prisma.paisAsignacion.upsert({
    where: {
      participanteId_paisId: { participanteId, paisId },
    },
    update: {},
    create: {
      participanteId,
      paisId,
    },
  });

  // Si hay precio por país definido, reflejar deuda como saldo negativo
  if (torneo.precioPaisBase) {
    await prisma.participante.update({
      where: { id: participanteId },
      data: {
        saldo: { decrement: torneo.precioPaisBase },
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/participantes");
}

