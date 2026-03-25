import { getTorneoActivo } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { formatCurrency } from "@/lib/utils";
import { Settings, Users, Globe, Swords, Flag } from "lucide-react";
import {
  generarDueloParaPartido,
  resolverPartido,
  actualizarPrecioPais,
  crearParticipante,
  asignarPaisAParticipante,
} from "./actions";

export default async function AdminPage() {
  const torneo = await getTorneoActivo();

  if (!torneo) {
    return (
      <div>
        <Header title="Admin" />
        <div className="p-8">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-zinc-500 mb-4">No hay torneo activo.</p>
              <p className="text-sm text-zinc-400">
                Crea uno desde la base de datos (seed) o agrega un flujo de creación aquí.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const precioPaisBase = torneo.precioPaisBase ? Number(torneo.precioPaisBase) : null;

  return (
    <div>
      <Header title="Admin" />
      <div className="p-6 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-amber-500" />
              Torneo actual
            </CardTitle>
            <p className="text-sm text-zinc-500">
              {torneo.nombre} · {torneo.ano} · {torneo.participantes.length} participantes,{" "}
              {torneo.paises.length} países
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <form action={actualizarPrecioPais} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="torneoId" value={torneo.id} />
              <div>
                <label className="block text-xs font-medium text-zinc-500">
                  Precio estándar por país
                </label>
                <input
                  name="precioPaisBase"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={precioPaisBase ?? 100}
                  className="mt-1 h-8 w-32 rounded-md border border-zinc-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
              </div>
              <button
                type="submit"
                className="h-8 rounded-md bg-amber-600 px-3 text-xs font-medium text-white hover:bg-amber-700"
              >
                Guardar precio
              </button>
              {precioPaisBase != null && (
                <p className="text-xs text-zinc-500">
                  Cada país asignado descuenta {formatCurrency(precioPaisBase)} del saldo del
                  participante.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {torneo.participantes.map((p) => (
                  <li key={p.id} className="flex justify-between text-sm">
                    <span className="font-medium">{p.nombre}</span>
                    <span className="text-zinc-500">
                      {p.paisesAsignados.length} países · saldo {formatCurrency(Number(p.saldo))}
                    </span>
                  </li>
                ))}
              </ul>

              <form action={crearParticipante} className="mt-2 space-y-2 rounded-lg border border-dashed border-zinc-300 p-3 text-sm dark:border-zinc-700">
                <input type="hidden" name="torneoId" value={torneo.id} />
                <p className="font-medium">Agregar participante</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-zinc-500">Nombre</label>
                    <input
                      name="nombre"
                      className="mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500">Apodo (opcional)</label>
                    <input
                      name="apodo"
                      className="mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500">Color (#hex)</label>
                    <input
                      name="colorHex"
                      defaultValue="#f59e0b"
                      className="mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-1 inline-flex h-8 items-center rounded-md bg-emerald-600 px-3 text-xs font-medium text-white hover:bg-emerald-700"
                >
                  Guardar participante
                </button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Países
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-500">
                {torneo.paises.length} selecciones. Asigna países a participantes y, si hay precio
                definido, se descuenta automáticamente de su saldo.
              </p>

              <form
                action={asignarPaisAParticipante}
                className="space-y-2 rounded-lg border border-dashed border-zinc-300 p-3 text-sm dark:border-zinc-700"
              >
                <input type="hidden" name="torneoId" value={torneo.id} />
                <p className="font-medium">Asignar país</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-zinc-500">Participante</label>
                    <select
                      name="participanteId"
                      className="mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                      defaultValue={torneo.participantes[0]?.id}
                    >
                      {torneo.participantes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500">País</label>
                    <select
                      name="paisId"
                      className="mt-1 h-8 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
                    >
                      {torneo.paises
                        .sort((a, b) => a.nombre.localeCompare(b.nombre))
                        .map((pais) => (
                          <option key={pais.id} value={pais.id}>
                            {pais.nombre} ({pais.codigoFifa})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-1 inline-flex h-8 items-center rounded-md bg-amber-600 px-3 text-xs font-medium text-white hover:bg-amber-700"
                >
                  Asignar país
                </button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Gestión rápida de partidos y duelos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Swords className="h-5 w-5" />
              Partidos y duelos automáticos
            </CardTitle>
            <p className="text-sm text-zinc-500">
              Crea/actualiza duelos automáticamente cuando se enfrentan países con dueño y resuelve el
              resultado para que se generen deudas.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {torneo.partidos.length === 0 ? (
              <p className="text-sm text-zinc-500">
                No hay partidos cargados. Puedes crearlos con Prisma Studio por ahora; al guardarlos,
                desde aquí generas los duelos y los resuelves.
              </p>
            ) : (
              <div className="space-y-3">
                {torneo.partidos.map((p) => {
                  const duelo = torneo.duelos.find((d) => d.partidoId === p.id);
                  return (
                    <div
                      key={p.id}
                      className="rounded-xl border border-zinc-200 p-3 text-sm dark:border-zinc-800"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Flag className="h-4 w-4 text-amber-500" />
                        <span className="font-medium">
                          {p.local.nombre} vs {p.visitante.nombre}
                        </span>
                        <span className="text-xs rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                          {p.estado}
                        </span>
                        {p.golesLocal != null && p.golesVisitante != null && (
                          <span className="text-xs text-zinc-500">
                            {p.golesLocal} - {p.golesVisitante}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <form action={generarDueloParaPartido}>
                          <input type="hidden" name="matchId" value={p.id} />
                          <button
                            type="submit"
                            className="rounded-lg bg-amber-600 px-3 py-1 text-xs font-medium text-white hover:bg-amber-700"
                          >
                            {duelo ? "Recrear duelo" : "Generar duelo"}
                          </button>
                        </form>
                        <form action={resolverPartido} className="flex items-center gap-1">
                          <input type="hidden" name="matchId" value={p.id} />
                          <input
                            name="golesLocal"
                            type="number"
                            min={0}
                            className="h-7 w-12 rounded-md border border-zinc-200 bg-white px-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                            placeholder="GL"
                            defaultValue={p.golesLocal ?? ""}
                          />
                          <span className="text-xs text-zinc-500">-</span>
                          <input
                            name="golesVisitante"
                            type="number"
                            min={0}
                            className="h-7 w-12 rounded-md border border-zinc-200 bg-white px-1 text-xs dark:border-zinc-700 dark:bg-zinc-900"
                            placeholder="GV"
                            defaultValue={p.golesVisitante ?? ""}
                          />
                          <button
                            type="submit"
                            className="ml-2 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700"
                          >
                            Resolver partido
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
