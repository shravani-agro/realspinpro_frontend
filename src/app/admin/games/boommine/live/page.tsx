import { GameRoundsTable } from "@/components/admin/games/GameRoundsTable";

export default function BoomMineLivePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 tracking-wider">BoomMine Live</h1>
      </div>
      <GameRoundsTable gameType="boommine" title="Active Player Sessions" />
    </div>
  );
}
