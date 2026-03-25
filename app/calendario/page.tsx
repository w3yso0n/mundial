import { getTorneoActivo } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

export default async function CalendarioPage() {
  const torneo = await getTorneoActivo();

  if (!torneo) {
    return (
      <div className="p-8">
        <p className="text-zinc-500">No hay torneo activo.</p>
      </div>
    );
  }

  const partidos = [...torneo.partidos].sort(
    (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
  );

  return (
    <div>
      <Header title="Calendario de partidos" />
      <div className="p-6 space-y-6">
        <p className="text-zinc-500">
          Fecha, equipos, resultado y participantes afectados por cada partido.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-500" />
              Partidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partidos.length > 0 ? (
                partidos.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 py-4 px-4 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-zinc-500 whitespace-nowrap">
                        {formatDate(p.fecha)}
                      </span>
                      <span className="font-medium">{p.local.nombre}</span>
                      <span className="text-zinc-400">
                        {p.estado === "jugado"
                          ? `${p.golesLocal ?? 0} - ${p.golesVisitante ?? 0}`
                          : "vs"}
                      </span>
                      <span className="font-medium">{p.visitante.nombre}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {p.estadio && (
                        <span className="text-zinc-500">{p.estadio}</span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.estado === "jugado"
                            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                            : "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                        }`}
                      >
                        {p.estado}
                      </span>
                      {p.duelos.length > 0 && (
                        <span className="text-zinc-500">
                          {p.duelos.length} duelo(s)
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-8 text-center text-zinc-500">
                  No hay partidos cargados. Agrega partidos desde Admin.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
