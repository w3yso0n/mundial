import { getTorneoActivo } from "@/lib/queries";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Crown, Trophy, Coins } from "lucide-react";
import { RealisticShell } from "@/components/dashboard/RealisticShell";
import {
  RealisticCard,
  RealisticCardBody,
  RealisticCardHeader,
} from "@/components/dashboard/RealisticCard";

export default async function DashboardPage() {
  const torneo = await getTorneoActivo();

  if (!torneo) {
    return (
      <RealisticShell title="Cucerdos Mundial">
        <RealisticCard tone="gold">
          <RealisticCardHeader
            title="No hay torneo activo"
            subtitle="Crea un torneo desde el panel de Admin para empezar."
          />
          <RealisticCardBody>
            <Link
              href="/admin"
              className="inline-flex items-center rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              Ir a Admin
            </Link>
          </RealisticCardBody>
        </RealisticCard>
      </RealisticShell>
    );
  }

  const participantes = torneo.participantes;
  const pozo = participantes.reduce(
    (sum, p) => sum + Math.max(0, Number(p.saldo)),
    0
  );

  const lider = [...participantes].sort(
    (a, b) => Number(b.saldo) - Number(a.saldo)
  )[0];
  const puntos = Math.max(0, Math.round(Number(lider?.saldo ?? 0))); // placeholder “pts” estilo imagen
  const puesto =
    lider?.id
      ? [...participantes]
          .sort((a, b) => Number(b.saldo) - Number(a.saldo))
          .findIndex((x) => x.id === lider.id) + 1
      : undefined;

  const proximoPartido = torneo.partidos
    .filter((p) => p.estado === "pendiente")
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())[0];

  const partidosDeHoy = torneo.partidos
    .filter((p) => p.estado === "pendiente")
    .slice(0, 4);

  const premios = [...participantes]
    .sort((a, b) => Number(b.saldo) - Number(a.saldo))
    .slice(0, 3)
    .map((p, idx) => ({ p, idx }));

  return (
    <RealisticShell
      title={torneo.nombre}
      right={
        <Link
          href="/tabla"
          className="text-xs font-semibold text-amber-200/90 hover:text-amber-200"
        >
          Ver tabla →
        </Link>
      }
    >
      {/* Barra superior estilo imagen */}
      <div className="grid gap-4 lg:grid-cols-12">
        <RealisticCard className="lg:col-span-4">
          <RealisticCardHeader
            title="Líder actual"
            subtitle={lider ? `${lider.nombre} · ${puntos} pts` : "—"}
            right={<Crown className="h-4 w-4 text-amber-300/90" />}
          />
          <RealisticCardBody>
            {lider ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10">
                  {lider.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={lider.avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    {lider.nombre}
                  </p>
                  <p className="text-xs text-zinc-300/70">
                    Saldo: {formatCurrency(Number(lider.saldo))}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-300/70">Sin datos.</p>
            )}
          </RealisticCardBody>
        </RealisticCard>

        <RealisticCard tone="gold" className="lg:col-span-5">
          <RealisticCardHeader
            title="Cucerdos Mundial 2026"
            subtitle="Pozo acumulado y posición"
            right={<Trophy className="h-4 w-4 text-amber-300/90" />}
          />
          <RealisticCardBody>
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-14 shrink-0">
                <Image
                  src="/trofeo.png"
                  alt="Trofeo mundial"
                  fill
                  className="object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]"
                  sizes="56px"
                  priority
                />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-zinc-300/70">Pozo acumulado</p>
                  <p className="mt-1 text-2xl font-extrabold tracking-tight text-amber-300">
                    {formatCurrency(pozo)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-300/70">Tu puesto</p>
                  <p className="mt-1 text-lg font-bold text-zinc-100/90">
                    {puesto ? `#${puesto}` : "—"}
                  </p>
                </div>
              </div>
            </div>
          </RealisticCardBody>
        </RealisticCard>

        <RealisticCard className="lg:col-span-3">
          <RealisticCardHeader
            title="Puntos"
            subtitle="(placeholder por ahora)"
            right={<Coins className="h-4 w-4 text-amber-300/90" />}
          />
          <RealisticCardBody>
            <p className="text-3xl font-extrabold tracking-tight text-zinc-100">
              {puntos} <span className="text-base font-semibold text-zinc-300/70">pts</span>
            </p>
          </RealisticCardBody>
        </RealisticCard>
      </div>

      {/* Paneles principales */}
      <div className="mt-5 grid gap-4 lg:grid-cols-12">
        <RealisticCard className="lg:col-span-7">
          <RealisticCardHeader
            title="Mis pronósticos"
            subtitle={proximoPartido ? formatDate(proximoPartido.fecha) : "Sin próximo partido"}
          />
          <RealisticCardBody>
            {proximoPartido ? (
              <div className="grid gap-4">
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-20 rounded-lg bg-white/5 ring-1 ring-white/10" />
                    <p className="mt-2 text-sm font-semibold">{proximoPartido.local.nombre}</p>
                  </div>
                  <div className="text-center text-sm font-extrabold tracking-widest text-zinc-200/80">
                    VS
                  </div>
                  <div className="text-center">
                    <div className="mx-auto h-12 w-20 rounded-lg bg-white/5 ring-1 ring-white/10" />
                    <p className="mt-2 text-sm font-semibold">{proximoPartido.visitante.nombre}</p>
                  </div>
                </div>

                <div className="mx-auto flex items-center gap-3 rounded-xl bg-black/25 px-4 py-3 ring-1 ring-white/10">
                  <span className="flex h-12 w-16 items-center justify-center rounded-lg bg-white/5 text-2xl font-extrabold ring-1 ring-white/10">
                    —
                  </span>
                  <span className="text-zinc-200/70">-</span>
                  <span className="flex h-12 w-16 items-center justify-center rounded-lg bg-white/5 text-2xl font-extrabold ring-1 ring-white/10">
                    —
                  </span>
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/calendario"
                    className="text-xs font-semibold text-amber-200/90 hover:text-amber-200"
                  >
                    Ver calendario →
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-300/70">No hay partidos pendientes.</p>
            )}
          </RealisticCardBody>
        </RealisticCard>

        <RealisticCard className="lg:col-span-5">
          <RealisticCardHeader title="Partidos de hoy" subtitle="Pendientes" />
          <RealisticCardBody>
            <div className="space-y-3">
              {partidosDeHoy.length > 0 ? (
                partidosDeHoy.map((p) => {
                  const duelo = torneo.duelos.find((d) => d.partidoId === p.id);
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-black/25 px-3 py-2 ring-1 ring-white/10"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {p.local.nombre} vs {p.visitante.nombre}
                        </p>
                        <p className="text-xs text-zinc-300/70">
                          {duelo
                            ? `${duelo.participanteA.nombre} vs ${duelo.participanteB.nombre}`
                            : "Sin duelo (faltan dueños)"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-zinc-300/70">Hora</p>
                        <p className="text-xs font-semibold text-zinc-100/90">
                          {new Date(p.fecha).toLocaleTimeString("es-AR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-zinc-300/70">No hay partidos pendientes.</p>
              )}
            </div>
          </RealisticCardBody>
        </RealisticCard>
      </div>

      {/* Premios / Podio */}
      <div className="mt-5">
        <RealisticCard tone="gold">
          <RealisticCardHeader title="Premios" subtitle="Top 3 (por saldo)" />
          <RealisticCardBody>
            <div className="grid gap-3 sm:grid-cols-3">
              {premios.map(({ p, idx }) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl bg-black/25 px-4 py-3 ring-1 ring-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400/15 text-sm font-extrabold text-amber-200 ring-1 ring-amber-200/20">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{p.nombre}</p>
                      <p className="text-xs text-zinc-300/70">
                        {formatCurrency(Number(p.saldo))}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RealisticCardBody>
        </RealisticCard>
      </div>
    </RealisticShell>
  );
}
