import { getTorneoActivo } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { formatCurrency } from "@/lib/utils";
import { Trophy, Medal } from "lucide-react";

export default async function TablaPage() {
  const torneo = await getTorneoActivo();

  if (!torneo) {
    return (
      <div className="p-8">
        <p className="text-zinc-500">No hay torneo activo.</p>
      </div>
    );
  }

  const ranking = [...torneo.participantes].sort(
    (a, b) => Number(b.saldo) - Number(a.saldo)
  );

  return (
    <div>
      <Header title="Tabla general" />
      <div className="p-6 space-y-8">
        <p className="text-zinc-500">
          Ranking por saldo (dinero ganado menos deudas). Los que más ganan arriba.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              Clasificación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800">
                    <th className="pb-3 font-medium">#</th>
                    <th className="pb-3 font-medium">Participante</th>
                    <th className="pb-3 font-medium text-right">Saldo</th>
                    <th className="pb-3 font-medium text-right">Países</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((p, i) => (
                    <tr
                      key={p.id}
                      className="border-b border-zinc-100 dark:border-zinc-800/50"
                    >
                      <td className="py-3">
                        {i < 3 ? (
                          <Medal
                            className={`h-5 w-5 ${
                              i === 0
                                ? "text-amber-500"
                                : i === 1
                                  ? "text-zinc-400"
                                  : "text-amber-700 dark:text-amber-600"
                            }`}
                          />
                        ) : (
                          <span className="text-zinc-500">{i + 1}</span>
                        )}
                      </td>
                      <td className="py-3 font-medium">{p.nombre}</td>
                      <td
                        className={`py-3 text-right font-semibold ${
                          Number(p.saldo) >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {formatCurrency(Number(p.saldo))}
                      </td>
                      <td className="py-3 text-right text-zinc-500">
                        {p.paisesAsignados.length}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
