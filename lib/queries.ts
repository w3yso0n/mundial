import { prisma } from "./db";

const TORNEO_SLUG = "quiniela-mundial-2026";

export async function getTorneoActivo() {
  if (!process.env.DATABASE_URL) return null;
  return prisma.torneo.findFirst({
    where: { activo: true, slug: TORNEO_SLUG },
    include: {
      participantes: {
        include: {
          paisesAsignados: { include: { pais: true } },
          _count: { select: { duelosComoA: true, duelosComoB: true } },
        },
      },
      paises: true,
      partidos: {
        include: { local: true, visitante: true, duelos: true },
        orderBy: { fecha: "asc" },
      },
      duelos: {
        include: {
          participanteA: true,
          participanteB: true,
          partido: { include: { local: true, visitante: true } },
          ganador: true,
        },
      },
      deudas: {
        include: { deudor: true, acreedor: true },
        orderBy: { createdAt: "desc" },
      },
      jornadas: { include: { partidos: true }, orderBy: { numero: "asc" } },
    },
  });
}

export async function getParticipantesConPaises(torneoId: string) {
  return prisma.participante.findMany({
    where: { torneoId },
    include: { paisesAsignados: { include: { pais: true } } },
    orderBy: { nombre: "asc" },
  });
}

export async function getDeudasPendientes(torneoId: string) {
  return prisma.deuda.findMany({
    where: { torneoId, estado: "pendiente" },
    include: { deudor: true, acreedor: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDuelosPorPartido(partidoId: string) {
  return prisma.duelo.findMany({
    where: { partidoId },
    include: {
      participanteA: true,
      participanteB: true,
      partido: { include: { local: true, visitante: true } },
    },
  });
}
