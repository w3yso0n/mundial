import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PAISES_MUNDIAL: { nombre: string; codigoFifa: string; grupo: string }[] = [
  // Grupo A
  { nombre: "México", codigoFifa: "MEX", grupo: "A" },
  { nombre: "Sudáfrica", codigoFifa: "RSA", grupo: "A" },
  { nombre: "Corea del Sur", codigoFifa: "KOR", grupo: "A" },
  {
    nombre: "Ganador Playoff UEFA D (Dinamarca / Macedonia del Norte / Chequia / Irlanda)",
    codigoFifa: "UE_D",
    grupo: "A",
  },

  // Grupo B
  { nombre: "Canadá", codigoFifa: "CAN", grupo: "B" },
  {
    nombre: "Ganador Playoff UEFA A (Italia / Irlanda del Norte / Gales / Bosnia y Herzegovina)",
    codigoFifa: "UE_A",
    grupo: "B",
  },
  { nombre: "Qatar", codigoFifa: "QAT", grupo: "B" },
  { nombre: "Suiza", codigoFifa: "SUI", grupo: "B" },

  // Grupo C
  { nombre: "Brasil", codigoFifa: "BRA", grupo: "C" },
  { nombre: "Marruecos", codigoFifa: "MAR", grupo: "C" },
  { nombre: "Haití", codigoFifa: "HAI", grupo: "C" },
  { nombre: "Escocia", codigoFifa: "SCO", grupo: "C" },

  // Grupo D
  { nombre: "Estados Unidos", codigoFifa: "USA", grupo: "D" },
  { nombre: "Paraguay", codigoFifa: "PAR", grupo: "D" },
  { nombre: "Australia", codigoFifa: "AUS", grupo: "D" },
  {
    nombre: "Ganador Playoff UEFA C (Turquía / Rumania / Eslovaquia / Kosovo)",
    codigoFifa: "UE_C",
    grupo: "D",
  },

  // Grupo E
  { nombre: "Alemania", codigoFifa: "GER", grupo: "E" },
  { nombre: "Curazao", codigoFifa: "CUW", grupo: "E" },
  { nombre: "Costa de Marfil", codigoFifa: "CIV", grupo: "E" },
  { nombre: "Ecuador", codigoFifa: "ECU", grupo: "E" },

  // Grupo F
  { nombre: "Países Bajos", codigoFifa: "NED", grupo: "F" },
  { nombre: "Japón", codigoFifa: "JPN", grupo: "F" },
  {
    nombre: "Ganador Playoff UEFA B (Ucrania / Suecia / Polonia / Albania)",
    codigoFifa: "UE_B",
    grupo: "F",
  },
  { nombre: "Túnez", codigoFifa: "TUN", grupo: "F" },

  // Grupo G
  { nombre: "Bélgica", codigoFifa: "BEL", grupo: "G" },
  { nombre: "Egipto", codigoFifa: "EGY", grupo: "G" },
  { nombre: "Irán", codigoFifa: "IRN", grupo: "G" },
  { nombre: "Nueva Zelanda", codigoFifa: "NZL", grupo: "G" },

  // Grupo H
  { nombre: "España", codigoFifa: "ESP", grupo: "H" },
  { nombre: "Cabo Verde", codigoFifa: "CPV", grupo: "H" },
  { nombre: "Arabia Saudita", codigoFifa: "KSA", grupo: "H" },
  { nombre: "Uruguay", codigoFifa: "URU", grupo: "H" },

  // Grupo I
  { nombre: "Francia", codigoFifa: "FRA", grupo: "I" },
  { nombre: "Senegal", codigoFifa: "SEN", grupo: "I" },
  {
    nombre: "Ganador Playoff Intercontinental 2 (Bolivia / Surinam / Irak)",
    codigoFifa: "IC2",
    grupo: "I",
  },
  { nombre: "Noruega", codigoFifa: "NOR", grupo: "I" },

  // Grupo J
  { nombre: "Argentina", codigoFifa: "ARG", grupo: "J" },
  { nombre: "Argelia", codigoFifa: "ALG", grupo: "J" },
  { nombre: "Austria", codigoFifa: "AUT", grupo: "J" },
  { nombre: "Jordania", codigoFifa: "JOR", grupo: "J" },

  // Grupo K
  { nombre: "Portugal", codigoFifa: "POR", grupo: "K" },
  { nombre: "Uzbekistán", codigoFifa: "UZB", grupo: "K" },
  { nombre: "Colombia", codigoFifa: "COL", grupo: "K" },
  {
    nombre: "Ganador Playoff Intercontinental 1 (Jamaica / Nueva Caledonia / RD Congo)",
    codigoFifa: "IC1",
    grupo: "K",
  },

  // Grupo L
  { nombre: "Inglaterra", codigoFifa: "ENG", grupo: "L" },
  { nombre: "Croacia", codigoFifa: "CRO", grupo: "L" },
  { nombre: "Ghana", codigoFifa: "GHA", grupo: "L" },
  { nombre: "Panamá", codigoFifa: "PAN", grupo: "L" },
];

async function main() {
  // Asegura que solo exista un torneo "principal" activo.
  await prisma.torneo.updateMany({
    where: { slug: { not: "cucerdos-mundial-2026" } },
    data: { activo: false },
  });

  const torneo = await prisma.torneo.upsert({
    where: { slug: "cucerdos-mundial-2026" },
    update: { activo: true },
    create: {
      nombre: "Cucerdos Mundial 2026",
      slug: "cucerdos-mundial-2026",
      ano: 2026,
      activo: true,
    },
  });

  const jornada = await prisma.jornada.upsert({
    where: { id: "jornada-grupos" },
    update: {},
    create: {
      id: "jornada-grupos",
      torneoId: torneo.id,
      nombre: "Fase de grupos",
      numero: 1,
      cerrada: false,
    },
  });

  // Limpieza para evitar "basura" (datos viejos de grupos/partidos)
  await prisma.duelo.deleteMany({ where: { torneoId: torneo.id } });
  await prisma.pick.deleteMany({ where: { partido: { torneoId: torneo.id } } });
  await prisma.partido.deleteMany({ where: { torneoId: torneo.id } });
  await prisma.paisAsignacion.deleteMany({ where: { participante: { torneoId: torneo.id } } });
  await prisma.pais.deleteMany({ where: { torneoId: torneo.id } });

  for (const p of PAISES_MUNDIAL) {
    await prisma.pais.upsert({
      where: {
        torneoId_codigoFifa: { torneoId: torneo.id, codigoFifa: p.codigoFifa },
      },
      update: {
        nombre: p.nombre,
        grupo: p.grupo,
      },
      create: {
        torneoId: torneo.id,
        nombre: p.nombre,
        codigoFifa: p.codigoFifa,
        grupo: p.grupo ?? undefined,
        estado: "vivo",
      },
    });
  }

  const seedParticipantes = [
    { id: "part-richy", nombre: "Richy", apodo: "Richy", colorHex: "#f59e0b" },
    { id: "part-pipe", nombre: "Pipe", apodo: "Pipe", colorHex: "#3b82f6" },
    { id: "part-joe", nombre: "Joe", apodo: "Joe", colorHex: "#22c55e" },
    { id: "part-banda", nombre: "Banda", apodo: "Banda", colorHex: "#a855f7" },
    { id: "part-emy", nombre: "Emy", apodo: "Emy", colorHex: "#ec4899" },
    { id: "part-yahir", nombre: "Yahir", apodo: "Yahir", colorHex: "#06b6d4" },
    { id: "part-chriss", nombre: "Chriss", apodo: "Chriss", colorHex: "#ef4444" },
    { id: "part-franco", nombre: "Franco", apodo: "Franco", colorHex: "#f97316" },
    { id: "part-braulio", nombre: "Braulio", apodo: "Braulio", colorHex: "#84cc16" },
    { id: "part-beto", nombre: "Beto", apodo: "Beto", colorHex: "#64748b" },
  ] as const;

  const seedParticipanteIds = seedParticipantes.map((p) => p.id);

  // Limpia participantes "basura" (ej. los del mock) para que solo queden los oficiales del seed.
  // También borra sus deudas y asignaciones antes para evitar errores por FK.
  await prisma.deuda.deleteMany({ where: { torneoId: torneo.id } });
  await prisma.paisAsignacion.deleteMany({ where: { participante: { torneoId: torneo.id } } });
  await prisma.participante.deleteMany({
    where: {
      torneoId: torneo.id,
      id: { notIn: seedParticipanteIds as unknown as string[] },
    },
  });

  const participantes = await Promise.all(
    seedParticipantes.map((p) =>
      prisma.participante.upsert({
        where: { id: p.id },
        update: {
          torneoId: torneo.id,
          nombre: p.nombre,
          apodo: p.apodo,
          colorHex: p.colorHex,
          saldo: 0,
        },
        create: {
          id: p.id,
          torneoId: torneo.id,
          nombre: p.nombre,
          apodo: p.apodo,
          colorHex: p.colorHex,
          saldo: 0,
        },
      })
    )
  );

  const paises = await prisma.pais.findMany({ where: { torneoId: torneo.id } });

  const byCode = (code: string) => {
    const p = paises.find((x) => x.codigoFifa === code);
    if (!p) {
      throw new Error(`No se encontró país con código ${code} en el seed`);
    }
    return p;
  };

  // Partidos programados (fase de grupos) - sin asignar países a participantes
  const partidosSeed: {
    fecha: string;
    local: string;
    visitante: string;
    estadio?: string;
  }[] = [
    // Grupo A
    { fecha: "2026-06-11T15:00:00Z", local: "MEX", visitante: "RSA", estadio: "Estadio Ciudad de México" },
    { fecha: "2026-06-11T22:00:00Z", local: "KOR", visitante: "UE_D", estadio: "Estadio Guadalajara" },

    { fecha: "2026-06-18T12:00:00Z", local: "UE_D", visitante: "RSA", estadio: "Atlanta Stadium" },
    { fecha: "2026-06-18T21:00:00Z", local: "MEX", visitante: "KOR", estadio: "Estadio Guadalajara" },

    { fecha: "2026-06-24T21:00:00Z", local: "UE_D", visitante: "MEX", estadio: "Estadio Ciudad de México" },
    { fecha: "2026-06-24T21:00:00Z", local: "RSA", visitante: "KOR", estadio: "Estadio Monterrey" },

    // Grupo B
    { fecha: "2026-06-12T15:00:00Z", local: "CAN", visitante: "UE_A", estadio: "Toronto Stadium" },
    { fecha: "2026-06-13T15:00:00Z", local: "QAT", visitante: "SUI", estadio: "San Francisco Bay Area Stadium" },
    { fecha: "2026-06-18T15:00:00Z", local: "SUI", visitante: "UE_A", estadio: "Los Angeles Stadium" },
    { fecha: "2026-06-18T18:00:00Z", local: "CAN", visitante: "QAT", estadio: "BC Place Vancouver" },
    { fecha: "2026-06-24T15:00:00Z", local: "SUI", visitante: "CAN", estadio: "BC Place Vancouver" },
    { fecha: "2026-06-24T15:00:00Z", local: "UE_A", visitante: "QAT", estadio: "Seattle Stadium" },

    // Grupo C
    { fecha: "2026-06-13T18:00:00Z", local: "BRA", visitante: "MAR", estadio: "Nueva York Nueva Jersey Stadium" },
    { fecha: "2026-06-13T21:00:00Z", local: "HAI", visitante: "SCO", estadio: "Boston Stadium" },
    { fecha: "2026-06-19T18:00:00Z", local: "SCO", visitante: "MAR", estadio: "Boston Stadium" },
    { fecha: "2026-06-19T21:00:00Z", local: "BRA", visitante: "HAI", estadio: "Philadelphia Stadium" },
    { fecha: "2026-06-24T18:00:00Z", local: "BRA", visitante: "SCO", estadio: "Miami Stadium" },
    { fecha: "2026-06-24T18:00:00Z", local: "MAR", visitante: "HAI", estadio: "Atlanta Stadium" },

    // Grupo D
    { fecha: "2026-06-12T21:00:00Z", local: "USA", visitante: "PAR", estadio: "Los Angeles Stadium" },
    { fecha: "2026-06-13T00:00:00Z", local: "AUS", visitante: "UE_C", estadio: "BC Place Vancouver" },
    { fecha: "2026-06-19T15:00:00Z", local: "USA", visitante: "AUS", estadio: "Seattle Stadium" },
    { fecha: "2026-06-19T00:00:00Z", local: "UE_C", visitante: "PAR", estadio: "San Francisco Bay Area Stadium" },
    { fecha: "2026-06-25T22:00:00Z", local: "UE_C", visitante: "USA", estadio: "Los Angeles Stadium" },
    { fecha: "2026-06-25T22:00:00Z", local: "PAR", visitante: "AUS", estadio: "San Francisco Bay Area Stadium" },

    // Grupo E
    { fecha: "2026-06-14T13:00:00Z", local: "GER", visitante: "CUW", estadio: "Houston Stadium" },
    { fecha: "2026-06-14T19:00:00Z", local: "CIV", visitante: "ECU", estadio: "Philadelphia Stadium" },
    { fecha: "2026-06-20T16:00:00Z", local: "GER", visitante: "CIV", estadio: "Toronto Stadium" },
    { fecha: "2026-06-20T22:00:00Z", local: "ECU", visitante: "CUW", estadio: "Kansas City Stadium" },
    { fecha: "2026-06-25T16:00:00Z", local: "CUW", visitante: "CIV", estadio: "Philadelphia Stadium" },
    { fecha: "2026-06-25T16:00:00Z", local: "ECU", visitante: "GER", estadio: "New York New Jersey Stadium" },

    // Grupo F
    { fecha: "2026-06-14T16:00:00Z", local: "NED", visitante: "JPN", estadio: "Dallas Stadium" },
    { fecha: "2026-06-14T22:00:00Z", local: "UE_B", visitante: "TUN", estadio: "Estadio Monterrey" },
    { fecha: "2026-06-20T13:00:00Z", local: "NED", visitante: "UE_B", estadio: "Houston Stadium" },
    { fecha: "2026-06-20T00:00:00Z", local: "TUN", visitante: "JPN", estadio: "Estadio Monterrey" },
    { fecha: "2026-06-25T19:00:00Z", local: "JPN", visitante: "UE_B", estadio: "Dallas Stadium" },
    { fecha: "2026-06-25T19:00:00Z", local: "TUN", visitante: "NED", estadio: "Kansas City Stadium" },

    // Grupo G
    { fecha: "2026-06-15T15:00:00Z", local: "BEL", visitante: "EGY", estadio: "Seattle Stadium" },
    { fecha: "2026-06-15T21:00:00Z", local: "IRN", visitante: "NZL", estadio: "Los Angeles Stadium" },
    { fecha: "2026-06-21T15:00:00Z", local: "BEL", visitante: "IRN", estadio: "Los Angeles Stadium" },
    { fecha: "2026-06-21T21:00:00Z", local: "NZL", visitante: "EGY", estadio: "BC Place Vancouver" },
    { fecha: "2026-06-26T23:00:00Z", local: "EGY", visitante: "IRN", estadio: "Seattle Stadium" },
    { fecha: "2026-06-26T23:00:00Z", local: "NZL", visitante: "BEL", estadio: "BC Place Vancouver" },

    // Grupo H
    { fecha: "2026-06-15T12:00:00Z", local: "ESP", visitante: "CPV", estadio: "Atlanta Stadium" },
    { fecha: "2026-06-15T18:00:00Z", local: "KSA", visitante: "URU", estadio: "Miami Stadium" },
    { fecha: "2026-06-21T12:00:00Z", local: "ESP", visitante: "KSA", estadio: "Atlanta Stadium" },
    { fecha: "2026-06-21T18:00:00Z", local: "URU", visitante: "CPV", estadio: "Miami Stadium" },
    { fecha: "2026-06-26T20:00:00Z", local: "CPV", visitante: "KSA", estadio: "Houston Stadium" },
    { fecha: "2026-06-26T20:00:00Z", local: "URU", visitante: "ESP", estadio: "Estadio Guadalajara" },

    // Grupo I
    { fecha: "2026-06-16T15:00:00Z", local: "FRA", visitante: "SEN", estadio: "New York New Jersey Stadium" },
    { fecha: "2026-06-16T18:00:00Z", local: "IC2", visitante: "NOR", estadio: "Boston Stadium" },
    { fecha: "2026-06-22T17:00:00Z", local: "FRA", visitante: "IC2", estadio: "Philadelphia Stadium" },
    { fecha: "2026-06-22T20:00:00Z", local: "NOR", visitante: "SEN", estadio: "Nueva York Nueva Jersey Stadium" },
    { fecha: "2026-06-26T15:00:00Z", local: "NOR", visitante: "FRA", estadio: "Boston Stadium" },
    { fecha: "2026-06-26T15:00:00Z", local: "SEN", visitante: "IC2", estadio: "Toronto Stadium" },

    // Grupo J
    { fecha: "2026-06-16T21:00:00Z", local: "ARG", visitante: "ALG", estadio: "Kansas City Stadium" },
    { fecha: "2026-06-17T00:00:00Z", local: "AUT", visitante: "JOR", estadio: "San Francisco Bay Area Stadium" },
    { fecha: "2026-06-22T13:00:00Z", local: "ARG", visitante: "AUT", estadio: "Dallas Stadium" },
    { fecha: "2026-06-22T23:00:00Z", local: "JOR", visitante: "ALG", estadio: "San Francisco Bay Area Stadium" },
    { fecha: "2026-06-27T22:00:00Z", local: "ALG", visitante: "AUT", estadio: "Kansas City Stadium" },
    { fecha: "2026-06-27T22:00:00Z", local: "JOR", visitante: "ARG", estadio: "Dallas Stadium" },

    // Grupo K
    { fecha: "2026-06-17T13:00:00Z", local: "POR", visitante: "IC1", estadio: "Houston Stadium" },
    { fecha: "2026-06-17T22:00:00Z", local: "UZB", visitante: "COL", estadio: "Estadio Ciudad de México" },
    { fecha: "2026-06-23T13:00:00Z", local: "POR", visitante: "UZB", estadio: "Houston Stadium" },
    { fecha: "2026-06-23T22:00:00Z", local: "COL", visitante: "IC1", estadio: "Estadio Guadalajara" },
    { fecha: "2026-06-27T19:30:00Z", local: "COL", visitante: "POR", estadio: "Miami Stadium" },
    { fecha: "2026-06-27T19:30:00Z", local: "IC1", visitante: "UZB", estadio: "Atlanta Stadium" },

    // Grupo L
    { fecha: "2026-06-17T16:00:00Z", local: "ENG", visitante: "CRO", estadio: "Dallas Stadium" },
    { fecha: "2026-06-17T19:00:00Z", local: "GHA", visitante: "PAN", estadio: "Toronto Stadium" },
    { fecha: "2026-06-23T16:00:00Z", local: "ENG", visitante: "GHA", estadio: "Boston Stadium" },
    { fecha: "2026-06-23T19:00:00Z", local: "PAN", visitante: "CRO", estadio: "Toronto Stadium" },
    { fecha: "2026-06-27T17:00:00Z", local: "PAN", visitante: "ENG", estadio: "New York New Jersey Stadium" },
    { fecha: "2026-06-27T17:00:00Z", local: "CRO", visitante: "GHA", estadio: "Philadelphia Stadium" },
  ];

  let orden = 1;
  for (const p of partidosSeed) {
    const local = byCode(p.local);
    const visitante = byCode(p.visitante);
    await prisma.partido.create({
      data: {
        torneoId: torneo.id,
        jornadaId: jornada.id,
        localId: local.id,
        visitanteId: visitante.id,
        fase: "grupos",
        grupo: local.grupo ?? null,
        orden,
        fecha: new Date(p.fecha),
        estadio: p.estadio ?? null,
        estado: "pendiente",
      } as any,
    });
    orden += 1;
  }

  console.log("Seed OK:", { torneo: torneo.slug, participantes: participantes.length, paises: paises.length });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
