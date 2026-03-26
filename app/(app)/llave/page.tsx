import { BracketMock } from "@/components/bracket/BracketMock";

export default function LlavePage() {
  return (
    <div className="h-full">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Llave</div>
        <div className="mt-1 text-lg font-semibold text-slate-100">Fase eliminatoria</div>
      </div>

      <BracketMock />
    </div>
  );
}

