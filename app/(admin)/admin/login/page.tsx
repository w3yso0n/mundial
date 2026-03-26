import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-dvh place-items-center px-6 py-10">
      <div className="glass w-full max-w-[520px] rounded-2xl p-6">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Admin</div>
          <div className="mt-1 text-xl font-semibold text-slate-100">Iniciar sesión</div>
          <div className="mt-2 text-sm text-slate-400">
            Acceso privado para administración del torneo.
          </div>
        </div>

        <form action="/api/admin/login" method="post" className="space-y-4">
          <label className="block">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Correo</div>
            <div className="flex items-center gap-3 rounded-xl bg-white/3 px-4 py-3 ring-1 ring-white/10">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                name="email"
                type="email"
                required
                defaultValue="admin@demo.com"
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
              />
            </div>
          </label>

          <label className="block">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Contraseña</div>
            <div className="flex items-center gap-3 rounded-xl bg-white/3 px-4 py-3 ring-1 ring-white/10">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                name="password"
                type="password"
                required
                defaultValue="12345678"
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
              />
            </div>
          </label>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-100 ring-1 ring-emerald-500/25 hover:bg-emerald-500/20"
          >
            Entrar
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-amber-400/8 p-4 text-xs text-amber-200/85 ring-1 ring-amber-400/15">
          Tip: si querés cambiar las credenciales sin tocar código, podés setear{" "}
          <span className="font-semibold">ADMIN_EMAIL</span> y{" "}
          <span className="font-semibold">ADMIN_PASSWORD</span> en tu <span className="font-semibold">.env</span>.
        </div>
      </div>
    </div>
  );
}

