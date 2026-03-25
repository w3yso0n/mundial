import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default async function ParticipantePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const participante = await prisma.participante.findUnique({
    where: { id },
    include: {
      paisesAsignados: { include: { pais: true } },
      torneo: true,
    },
  });

  if (!participante) notFound();

  const saldoNum = Number(participante.saldo);
  const deuda = saldoNum < 0 ? Math.abs(saldoNum) : 0;

  return (
    <div>
      <Header title={participante.nombre} />
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div
                className="h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                style={{ backgroundColor: participante.colorHex ?? "#6366f1" }}
              >
                {participante.avatarUrl ? (
                  <img
                    src={participante.avatarUrl}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  participante.nombre.charAt(0)
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{participante.nombre}</CardTitle>
                {participante.apodo && (
                  <p className="text-zinc-500">{participante.apodo}</p>
                )}
                <p
                  className={`mt-2 text-lg font-semibold ${
                    saldoNum >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {deuda > 0 ? `Debe: ${formatCurrency(deuda)}` : formatCurrency(saldoNum)}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Países asignados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {participante.paisesAsignados.map((a) => (
                <Link
                  key={a.paisId}
                  href="/paises"
                  className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-800"
                >
                  {a.pais.nombre} ({a.pais.codigoFifa})
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Link
            href="/participantes"
            className="text-sm font-medium text-amber-600 hover:underline dark:text-amber-400"
          >
            ← Volver a participantes
          </Link>
        </div>
      </div>
    </div>
  );
}
