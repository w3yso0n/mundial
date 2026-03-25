"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

export function RealisticShell({
  title,
  right,
  children,
  className,
}: {
  title?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen text-zinc-100", className)}>
      <div className="relative isolate overflow-hidden">
        {/* Fondo de estadio real */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="/fondo_estadio.png"
            alt="Estadio mundialista"
            fill
            priority
            className="object-cover"
          />
        </div>
        {/* Overlays para dar contraste al contenido */}
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-black/60 via-black/40 to-black/80" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[18px_18px] opacity-40" />

        <header className="sticky top-0 z-10 border-b border-amber-200/10 bg-black/35 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
            <h1 className="text-sm font-semibold tracking-wide text-zinc-100/90">
              {title ?? "Quiniela Mundialera"}
            </h1>
            <div>{right}</div>
          </div>
        </header>

        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </div>
    </div>
  );
}

