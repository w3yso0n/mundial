import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Participante } from "@prisma/client";
import type { PaisAsignacion } from "@prisma/client";

type ParticipantWithPaises = Participante & {
  paisesAsignados: (PaisAsignacion & { pais: { nombre: string; codigoFifa: string; banderaUrl: string | null } })[];
};

function getBadge(saldo: number): string {
  if (saldo > 200) return "enrachado";
  if (saldo < -100) return "moroso";
  if (saldo === 0) return "en paz";
  return "en juego";
}

function getBadgeColor(badge: string): string {
  switch (badge) {
    case "enrachado":
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400";
    case "moroso":
      return "bg-red-500/20 text-red-700 dark:text-red-400";
    case "en paz":
      return "bg-zinc-500/20 text-zinc-600 dark:text-zinc-400";
    default:
      return "bg-amber-500/20 text-amber-700 dark:text-amber-400";
  }
}

export function ParticipantCard({ p }: { p: ParticipantWithPaises }) {
  const saldoNum = Number(p.saldo);
  const badge = getBadge(saldoNum);
  const deuda = saldoNum < 0 ? Math.abs(saldoNum) : 0;

  return (
    <Link href={`/participantes/${p.id}`}>
      <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-start gap-4">
            <div
              className="h-14 w-14 shrink-0 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-xl font-bold text-white"
              style={{ backgroundColor: p.colorHex ?? "#6366f1" }}
            >
              {p.avatarUrl ? (
                <img
                  src={p.avatarUrl}
                  alt={p.nombre}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                (p.nombre ?? "?").charAt(0)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold truncate">{p.nombre}</h3>
              {p.apodo && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                  {p.apodo}
                </p>
              )}
              <span
                className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${getBadgeColor(badge)}`}
              >
                {badge}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="flex flex-wrap gap-1.5">
            {p.paisesAsignados.slice(0, 4).map((a) => (
              <span
                key={a.paisId}
                className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
              >
                {a.pais.codigoFifa}
              </span>
            ))}
            {p.paisesAsignados.length > 4 && (
              <span className="text-xs text-zinc-400">+{p.paisesAsignados.length - 4}</span>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800">
            <span className="text-sm text-zinc-500">Saldo</span>
            <span
              className={`font-semibold ${
                saldoNum >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {deuda > 0 ? `Debe: ${formatCurrency(deuda)}` : formatCurrency(saldoNum)}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, 50 + (saldoNum / 4)))}%`,
                backgroundColor: p.colorHex ?? "#6366f1",
              }}
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
