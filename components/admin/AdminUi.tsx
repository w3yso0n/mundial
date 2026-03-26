"use client";

import { clsx } from "clsx";
import {
  CirclePlus,
  Users,
  CalendarPlus,
  Save,
  Trash2,
  Settings,
  Trophy,
} from "lucide-react";
import { useMemo, useState } from "react";

type Participante = {
  id: string;
  nombre: string;
  apodo: string | null;
  colorHex: string | null;
  paisesAsignados?: {
    id: string;
    paisId: string;
    pais: { id: string; codigoFifa: string; nombre: string };
  }[];
};

type Pais = {
  id: string;
  nombre: string;
  codigoFifa: string;
  grupo: string | null;
};

type Partido = {
  id: string;
  fecha: string;
  fechaLabel: string;
  estadio: string | null;
  fase: string;
  grupo: string | null;
  orden: number | null;
  estado: string;
  localId: string;
  visitanteId: string;
  ganadorId: string | null;
  golesLocal: number | null;
  golesVisitante: number | null;
  local: { codigoFifa: string; nombre: string };
  visitante: { codigoFifa: string; nombre: string };
};

type Torneo = {
  id: string;
  nombre: string;
  precioPaisBase: string | null;
};

function SectionTitle({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
          {icon}
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-100">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-slate-400">{subtitle}</div> : null}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {label}
      </div>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full rounded-xl bg-white/3 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-white/10 placeholder:text-slate-600",
        props.className
      )}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={clsx(
        // Nota: el dropdown nativo usa <option>; forzamos contraste en tema oscuro.
        "w-full rounded-xl bg-white/3 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-white/10 [&>option]:bg-slate-950 [&>option]:text-slate-100 [&>option:disabled]:text-slate-500",
        props.className
      )}
    />
  );
}

function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ring-1 transition disabled:opacity-60",
        variant === "primary" &&
          "bg-emerald-500/20 text-white ring-emerald-400/25 hover:bg-emerald-500/25",
        variant === "ghost" &&
          "bg-white/5 text-slate-100 ring-white/10 hover:bg-white/10",
        variant === "danger" &&
          "bg-rose-500/10 text-rose-200 ring-rose-500/20 hover:bg-rose-500/15",
        props.className
      )}
    >
      {children}
    </button>
  );
}

export function AdminUi({
  torneo,
  participantes,
  paises,
  partidos,
}: {
  torneo: Torneo;
  participantes: Participante[];
  paises: Pais[];
  partidos: Partido[];
}) {
  const paisById = useMemo(() => new Map(paises.map((p) => [p.id, p])), [paises]);
  const assignedPaisToParticipante = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of participantes) {
      for (const a of p.paisesAsignados ?? []) m.set(a.paisId, p.id);
    }
    return m;
  }, [participantes]);

  const [savingSettings, setSavingSettings] = useState(false);
  const [creatingParticipant, setCreatingParticipant] = useState(false);
  const [creatingMatch, setCreatingMatch] = useState(false);

  async function postForm(path: string, form: HTMLFormElement) {
    const res = await fetch(path, { method: "POST", body: new FormData(form) });
    if (!res.ok) throw new Error(await res.text());
    window.location.reload();
  }

  async function onMatchRowSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = submitter?.getAttribute("value") ?? "update";
    const path = intent === "delete" ? "/api/admin/matches/delete" : "/api/admin/matches/update";
    await postForm(path, form);
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="rounded-2xl bg-white/3 p-5 ring-1 ring-white/10">
          <SectionTitle
            icon={<Settings className="h-5 w-5 text-slate-200" />}
            title="Ajustes del torneo"
            subtitle="Precio base por equipo y configuración general."
          />

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setSavingSettings(true);
              try {
                await postForm("/api/admin/torneo/update", e.currentTarget);
              } finally {
                setSavingSettings(false);
              }
            }}
            className="space-y-4"
          >
            <input type="hidden" name="torneoId" value={torneo.id} />

            <Field label="Precio por equipo ($)">
              <Input
                name="precioPaisBase"
                inputMode="decimal"
                placeholder="200"
                defaultValue={torneo.precioPaisBase ?? ""}
              />
            </Field>

            <Button type="submit" disabled={savingSettings}>
              <Save className="h-4 w-4" />
              Guardar
            </Button>
          </form>
        </section>

        <section className="rounded-2xl bg-white/3 p-5 ring-1 ring-white/10">
          <SectionTitle
            icon={<Users className="h-5 w-5 text-slate-200" />}
            title="Participantes"
            subtitle="Alta/baja rápida de jugadores."
          />

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCreatingParticipant(true);
              try {
                await postForm("/api/admin/participants/create", e.currentTarget);
              } finally {
                setCreatingParticipant(false);
              }
            }}
            className="grid grid-cols-1 gap-3"
          >
            <input type="hidden" name="torneoId" value={torneo.id} />
            <Field label="Nombre">
              <Input name="nombre" required placeholder="Pipe" />
            </Field>
            <Field label="Apodo (opcional)">
              <Input name="apodo" placeholder="Pipe" />
            </Field>
            <Field label="Color HEX (opcional)">
              <Input name="colorHex" placeholder="#3b82f6" />
            </Field>

            <Button type="submit" disabled={creatingParticipant}>
              <CirclePlus className="h-4 w-4" />
              Agregar participante
            </Button>
          </form>

          <div className="mt-5 max-h-[340px] space-y-2 overflow-auto pr-1">
            {participantes.length ? (
              participantes.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl bg-white/3 px-3 py-2 ring-1 ring-white/8"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-100">{p.nombre}</div>
                      <div className="text-xs text-slate-400">{p.apodo ?? "—"}</div>
                    </div>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await postForm("/api/admin/participants/delete", e.currentTarget);
                      }}
                    >
                      <input type="hidden" name="participanteId" value={p.id} />
                      <Button
                        type="submit"
                        variant="danger"
                        className="px-3 py-2"
                        title="Eliminar participante"
                        aria-label={`Eliminar participante ${p.nombre}`}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Eliminar</span>
                      </Button>
                    </form>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {(p.paisesAsignados ?? []).length ? (
                        (p.paisesAsignados ?? []).map((a) => (
                          <div
                            key={a.id}
                            className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-2 py-1 text-xs text-slate-200 ring-1 ring-white/10"
                            title={a.pais.nombre}
                          >
                            <span className="font-semibold text-emerald-200">{a.pais.codigoFifa}</span>
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                await postForm("/api/admin/assignments/delete", e.currentTarget);
                              }}
                            >
                              <input type="hidden" name="asignacionId" value={a.id} />
                              <button
                                type="submit"
                                className="rounded-md px-1 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                                aria-label={`Quitar ${a.pais.codigoFifa} de ${p.nombre}`}
                                title="Quitar equipo"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </form>
                          </div>
                        ))
                      ) : (
                        <div className="text-xs text-slate-500">Sin equipos asignados.</div>
                      )}
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        await postForm("/api/admin/assignments/create", e.currentTarget);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="participanteId" value={p.id} />
                      <Select name="paisId" defaultValue="" className="py-2">
                        <option value="" disabled>
                          Asignar equipo…
                        </option>
                        {paises
                          .filter((pais) => {
                            const owner = assignedPaisToParticipante.get(pais.id);
                            if (owner && owner !== p.id) return false; // ya está asignado a otra persona
                            // Evitar mostrar repetidos si ya lo tiene este participante
                            return !(p.paisesAsignados ?? []).some((a) => a.paisId === pais.id);
                          })
                          .map((pais) => (
                            <option key={pais.id} value={pais.id}>
                              {pais.codigoFifa} — {pais.nombre}
                            </option>
                          ))}
                      </Select>
                      <Button type="submit" variant="ghost" className="px-3 py-2">
                        <CirclePlus className="h-4 w-4" />
                        <span className="hidden sm:inline">Agregar</span>
                      </Button>
                    </form>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-white/3 px-3 py-3 text-sm text-slate-400 ring-1 ring-white/8">
                No hay participantes cargados en este torneo.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white/3 p-5 ring-1 ring-white/10">
          <SectionTitle
            icon={<CalendarPlus className="h-5 w-5 text-slate-200" />}
            title="Crear partido"
            subtitle="Agrega partidos a grupos o eliminatoria."
          />

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setCreatingMatch(true);
              try {
                await postForm("/api/admin/matches/create", e.currentTarget);
              } finally {
                setCreatingMatch(false);
              }
            }}
            className="grid grid-cols-1 gap-3"
          >
            <input type="hidden" name="torneoId" value={torneo.id} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Fase">
                <Select name="fase" defaultValue="grupos">
                  <option value="grupos">grupos</option>
                  <option value="octavos">octavos</option>
                  <option value="cuartos">cuartos</option>
                  <option value="semis">semis</option>
                  <option value="final">final</option>
                </Select>
              </Field>
              <Field label="Grupo (opcional)">
                <Input name="grupo" placeholder="A" />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Local">
                <Select name="localId" required>
                  <option value="" disabled>
                    Selecciona…
                  </option>
                  {paises.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigoFifa} — {p.nombre}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Visitante">
                <Select name="visitanteId" required>
                  <option value="" disabled>
                    Selecciona…
                  </option>
                  {paises.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.codigoFifa} — {p.nombre}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Fecha (ISO)">
                <Input name="fecha" required placeholder="2026-06-11T15:00:00Z" />
              </Field>
              <Field label="Orden (opcional)">
                <Input name="orden" inputMode="numeric" placeholder="1" />
              </Field>
            </div>

            <Field label="Estadio (opcional)">
              <Input name="estadio" placeholder="Estadio Ciudad de México" />
            </Field>

            <Button type="submit" disabled={creatingMatch}>
              <CirclePlus className="h-4 w-4" />
              Agregar partido
            </Button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl bg-white/3 p-5 ring-1 ring-white/10">
        <SectionTitle
          icon={<Trophy className="h-5 w-5 text-amber-200" />}
          title="Partidos"
          subtitle="Edita marcador, estado y ganador."
        />

        <div className="overflow-x-auto">
          <div className="min-w-[980px] overflow-hidden rounded-2xl ring-1 ring-white/10">
            <div className="grid grid-cols-[160px_1fr_1fr_120px_160px_120px_minmax(170px,230px)] gap-2 border-b border-white/10 bg-white/2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              <div>Fase</div>
              <div>Local</div>
              <div>Visitante</div>
              <div>Marcador</div>
              <div>Ganador</div>
              <div>Estado</div>
              <div>Guardar</div>
            </div>

            <div className="divide-y divide-white/8">
              {partidos.map((m) => (
                <form
                  key={m.id}
                  className="grid grid-cols-[160px_1fr_1fr_120px_160px_120px_minmax(170px,230px)] items-center gap-2 px-4 py-3"
                  onSubmit={onMatchRowSubmit}
                >
                  <input type="hidden" name="partidoId" value={m.id} />

                  <div className="text-sm text-slate-200">
                    <div className="font-semibold">{m.fase}</div>
                    <div className="text-xs text-slate-500">
                      {m.grupo ? `Grupo ${m.grupo} · ` : ""}
                      {m.orden ? `#${m.orden} · ` : ""}
                      {m.fechaLabel}
                    </div>
                  </div>

                  <div className="text-sm text-slate-100">
                    <div className="font-semibold">{m.local.codigoFifa}</div>
                    <div className="text-xs text-slate-400">{m.local.nombre}</div>
                  </div>

                  <div className="text-sm text-slate-100">
                    <div className="font-semibold">{m.visitante.codigoFifa}</div>
                    <div className="text-xs text-slate-400">{m.visitante.nombre}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Input
                      name="golesLocal"
                      inputMode="numeric"
                      placeholder="-"
                      defaultValue={m.golesLocal ?? ""}
                      className="px-3 py-2"
                    />
                    <span className="text-slate-500">-</span>
                    <Input
                      name="golesVisitante"
                      inputMode="numeric"
                      placeholder="-"
                      defaultValue={m.golesVisitante ?? ""}
                      className="px-3 py-2"
                    />
                  </div>

                  <Select name="ganadorId" defaultValue={m.ganadorId ?? ""}>
                    <option value="">—</option>
                    <option value={m.localId}>
                      {paisById.get(m.localId)?.codigoFifa ?? "Local"} (local)
                    </option>
                    <option value={m.visitanteId}>
                      {paisById.get(m.visitanteId)?.codigoFifa ?? "Visitante"} (visitante)
                    </option>
                  </Select>

                  <Select name="estado" defaultValue={m.estado}>
                    <option value="pendiente">pendiente</option>
                    <option value="jugado">jugado</option>
                    <option value="cancelado">cancelado</option>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      variant="ghost"
                      className="flex-1 px-4 py-2"
                      value="update"
                      title="Guardar cambios"
                    >
                      <Save className="h-4 w-4" />
                      Guardar
                    </Button>
                    <Button
                      type="submit"
                      variant="danger"
                      className="shrink-0 px-3 py-2"
                      value="delete"
                      name="intent"
                      title="Eliminar partido"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Eliminar</span>
                    </Button>
                  </div>
                </form>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

