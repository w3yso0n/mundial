"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const RealisticCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { tone?: "gold" | "steel" }
>(({ className, tone = "steel", ...props }, ref) => {
  const ring =
    tone === "gold"
      ? "ring-1 ring-amber-200/20"
      : "ring-1 ring-zinc-200/10";

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-linear-to-b from-zinc-950/55 to-zinc-900/35 shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
        ring,
        className
      )}
      {...props}
    >
      {/* borde metálico */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl p-px",
          tone === "gold"
            ? "bg-[linear-gradient(135deg,rgba(245,158,11,0.35),rgba(255,255,255,0.12),rgba(245,158,11,0.18))]"
            : "bg-[linear-gradient(135deg,rgba(244,244,245,0.16),rgba(255,255,255,0.06),rgba(244,244,245,0.12))]"
        )}
      >
        <div className="h-full w-full rounded-2xl bg-black/25" />
      </div>

      {/* brillo sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/3 h-48 w-48 rotate-12 rounded-full bg-white/10 blur-3xl"
      />

      <div className="relative">{props.children}</div>
    </div>
  );
});
RealisticCard.displayName = "RealisticCard";

export function RealisticCardHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-3 p-5 pb-3", className)}>
      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-wide text-zinc-100/90">
          {title}
        </p>
        {subtitle && (
          <p className="mt-1 text-xs text-zinc-300/70">{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

export function RealisticCardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-5 pb-5", className)}>{children}</div>;
}

