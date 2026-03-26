import { GroupsGridDb } from "@/components/groups/GroupsGridDb";

export default function GruposPage() {
  return (
    <div className="h-full">
      <div className="mb-4">
        <div className="text-xs uppercase tracking-[0.25em] text-slate-400">Grupos</div>
        <div className="mt-1 text-lg font-semibold text-slate-100">Vista por grupo</div>
      </div>
      <GroupsGridDb />
    </div>
  );
}

