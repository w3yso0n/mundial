import { getTorneoActivo } from "@/lib/queries";
import { ParticipantCard } from "@/components/dashboard/ParticipantCard";
import { Header } from "@/components/layout/Header";

export default async function ParticipantesPage() {
  const torneo = await getTorneoActivo();

  if (!torneo) {
    return (
      <div className="p-8">
        <p className="text-zinc-500">No hay torneo activo.</p>
      </div>
    );
  }

  return (
    <div>
      <Header title="Participantes" />
      <div className="p-6">
        <p className="mb-6 text-zinc-500">
          {torneo.participantes.length} amigos en la quiniela. Cada uno tiene sus países asignados y un saldo.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {torneo.participantes.map((p) => (
            <ParticipantCard
              key={p.id}
              p={{
                ...p,
                paisesAsignados: p.paisesAsignados.map((a) => ({ ...a, pais: a.pais })),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
