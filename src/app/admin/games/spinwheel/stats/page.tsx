import { GameStatsCards } from "@/components/admin/games/GameStatsCards";
import { GameBetsTable } from "@/components/admin/games/GameBetsTable";

export default function SpinwheelStatsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 tracking-wider">Spinwheel Stats</h1>
      </div>
      <GameStatsCards gameType="spinwheel" />
      <div className="mt-8">
        <GameBetsTable gameType="spinwheel" title="Recent Betting Activity" />
      </div>
    </div>
  );
}
