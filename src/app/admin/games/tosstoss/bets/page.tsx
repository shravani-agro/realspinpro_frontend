import { GameBetsTable } from "@/components/admin/games/GameBetsTable";

export default function TossTossBetsPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 tracking-wider">TossToss Bets</h1>
      </div>
      <GameBetsTable gameType="tosstoss" title="Live TossToss Bets" />
    </div>
  );
}
