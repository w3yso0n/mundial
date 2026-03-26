import { RankingTable } from "@/components/ranking/RankingTable";

export default function RankingPage() {
  return (
    <div className="h-full">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Ranking</div>
        <div className="mt-1 text-lg font-semibold text-slate-100">Tabla general</div>
      </div>
      <RankingTable />
    </div>
  );
}

