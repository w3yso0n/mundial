import { getTorneoActivo } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Swords } from "lucide-react";

export default async function DuelosPage() {
  const torneo = await getTorneoActivo();

  if (!torneo) {
    return (
      <div className="p-8">
        <p className="text-zinc-500">No hay torneo activo.</p>
      </div>
    );
  }

  const duelos = torneo.duelos;
  const pendientes = duelos.filter((d) => d.estado === "pendiente");
  const resueltos = duelos.filter((d) => d.estado === "resuelto" || d.estado === "empate");

  return (
    <div>
      <Header title="Cruces / Duelos" />
      <div className="p-6 space-y-8">
        <p className="text-zinc-500">
          Cuando dos amigos tienen países que se enfrentan, se genera un duelo. Aquí ves quién va contra quién y el resultado.
        </p>

        {pendientes.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <Swords className="h-5 w-5 text-amber-500" />
              Duelos pendientes
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pendientes.map((d) => (
                <Card key={d.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between gap-2">
                      <span>{d.participanteA.nombre}</span>
                      <span className="text-zinc-400">vs</span>
                      <span>{d.participanteB.nombre}</span>
                    </CardTitle>
                    <p className="text-sm text-zinc-500">
                      {d.partido.local.nombre} vs {d.partido.visitante.nombre}
                    </p>
                    <p className="text-xs text-zinc-400">{formatDate(d.partido.fecha)}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Monto: <strong>{formatCurrency(Number(d.montoApostado))}</strong>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {resueltos.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold">Duelos resueltos</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resueltos.map((d) => (
                <Card key={d.id} className="opacity-90">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center justify-between gap-2">
                      <span>{d.participanteA.nombre}</span>
                      <span className="text-zinc-400">vs</span>
                      <span>{d.participanteB.nombre}</span>
                    </CardTitle>
                    <p className="text-sm text-zinc-500">
                      {d.partido.local.nombre} {d.partido.golesLocal ?? "?"} -{" "}
                      {d.partido.golesVisitante ?? "?"} {d.partido.visitante.nombre}
                    </p>
                    {d.ganador ? (
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Ganador: {d.ganador.nombre}
                      </p>
                    ) : (
                      <p className="text-sm text-zinc-500">Empate</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Monto: {formatCurrency(Number(d.montoApostado))}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {duelos.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-zinc-500">
              Aún no hay duelos. Cuando dos participantes tengan países que se enfrenten en un partido, aparecerán aquí.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
