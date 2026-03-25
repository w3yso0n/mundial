import { getTorneoActivo } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import Link from "next/link";

export default async function PaisesPage() {
  const torneo = await getTorneoActivo();

  if (!torneo) {
    return (
      <div className="p-8">
        <p className="text-zinc-500">No hay torneo activo.</p>
      </div>
    );
  }

  const porGrupo = torneo.paises.reduce<Record<string, typeof torneo.paises>>((acc, p) => {
    const g = p.grupo ?? "Sin grupo";
    if (!acc[g]) acc[g] = [];
    acc[g].push(p);
    return acc;
  }, {});

  const grupos = Object.entries(porGrupo).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div>
      <Header title="Países / Selecciones" />
      <div className="p-6 space-y-8">
        <p className="text-zinc-500">
          Todas las selecciones del torneo. Estado: vivo, eliminado o campeón.
        </p>
        {grupos.map(([grupo, paises]) => (
          <section key={grupo}>
            <h2 className="mb-4 text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Grupo {grupo}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paises.map((pais) => (
                <Card key={pais.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-sm font-bold dark:bg-zinc-800">
                        {pais.banderaUrl ? (
                          <img
                            src={pais.banderaUrl}
                            alt=""
                            className="h-full w-full rounded-lg object-cover"
                          />
                        ) : (
                          pais.codigoFifa
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-base">{pais.nombre}</CardTitle>
                        <p className="text-xs text-zinc-500">{pais.codigoFifa}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p>
                      Puntos: <strong>{pais.puntos}</strong> · GF: {pais.golesFavor} · GC:{" "}
                      {pais.golesContra}
                    </p>
                    <p
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        pais.estado === "vivo"
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : pais.estado === "campeon"
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                            : "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {pais.estado}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
