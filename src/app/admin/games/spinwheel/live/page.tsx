import { GameRoundsTable } from "@/components/admin/games/GameRoundsTable";

export default function SpinwheelLivePage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 tracking-wider">Spinwheel Live</h1>
      </div>
      <GameRoundsTable gameType="spinwheel" title="Live Rounds Monitoring" />
    </div>
  );
}
