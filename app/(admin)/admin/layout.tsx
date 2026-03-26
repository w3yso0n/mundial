import Link from "next/link";
import { Shield, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-6">
        <header className="glass mb-5 flex items-center justify-between rounded-2xl px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Shield className="h-5 w-5 text-emerald-200" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100">Panel de administración</div>
              <div className="text-xs text-slate-400">Acceso privado</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 ring-1 ring-white/10 hover:bg-white/10"
            >
              Volver al dashboard
            </Link>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400/10 px-4 py-2 text-sm font-semibold text-amber-200 ring-1 ring-amber-400/20 hover:bg-amber-400/15"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </form>
          </div>
        </header>

        <main className="glass rounded-2xl p-5">{children}</main>
      </div>
    </div>
  );
}

