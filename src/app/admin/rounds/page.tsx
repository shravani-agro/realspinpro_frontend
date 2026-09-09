"use client";

import { useState, useEffect } from "react";
import { PlayCircle, CheckCircle2, Clock, X, TrendingUp, TrendingDown } from "lucide-react";
import { fetchAdminRounds, fetchAdminRoundDetails } from "@/lib/api";

export default function LiveRoundsPage() {
  const [rounds, setRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRound, setSelectedRound] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const loadRounds = async () => {
    try {
      const data = await fetchAdminRounds();
      setRounds(data || []);
    } catch (err) {
      console.error("Error loading rounds:", err);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    loadRounds();
    const interval = setInterval(loadRounds, 5000); // Live poll every 5s
    return () => clearInterval(interval);
  }, []);

  const handleRowClick = async (roundIdRaw: string) => {
    // ID comes as RND-12345
    const roundId = parseInt(roundIdRaw.replace('RND-', ''));
    if (isNaN(roundId)) return;
    
    setDetailsLoading(true);
    setSelectedRound({ id: roundIdRaw, round_id: roundId }); // Placeholder
    
    try {
      const details = await fetchAdminRoundDetails(roundId);
      setSelectedRound(details);
    } catch (err) {
      console.error("Error loading round details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          Live Rounds
        </h1>
        <button className="px-4 py-2 rounded-lg bg-neon-purple text-white font-bold text-sm hover:bg-neon-purple/80 transition-colors shadow-[0_0_15px_rgba(176,38,255,0.4)] flex items-center gap-2">
          <PlayCircle className="w-4 h-4" /> Pause Engine
        </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 border-b border-white/10 text-gray-300 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Round ID</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">Status / Time</th>
                <th className="px-6 py-4">Total Pool</th>
                <th className="px-6 py-4">Multiplier Result</th>
                <th className="px-6 py-4">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && rounds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading live rounds...
                  </td>
                </tr>
              ) : rounds.map((round) => (
                <tr 
                  key={round.id} 
                  onClick={() => handleRowClick(round.id)}
                  className={`hover:bg-white/[0.05] cursor-pointer transition-colors ${round.status === 'locked' ? 'bg-red-500/[0.02]' : ''}`}
                >
                  <td className="px-6 py-4 font-mono text-gray-500">{round.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{round.game}</td>
                  <td className="px-6 py-4">
                    {round.status === 'locked' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> Locked</span>}
                    {round.status === 'betting' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30"><Clock className="w-3 h-3" /> Betting</span>}
                    {round.status === 'settled' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30"><CheckCircle2 className="w-3 h-3" /> Settled</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-white">{round.pool}</td>
                  <td className={`px-6 py-4 font-black text-lg ${round.status === 'locked' ? 'text-neon-blue drop-shadow-[0_0_5px_var(--color-neon-blue)]' : round.status === 'betting' ? 'text-gray-600' : 'text-neon-emerald'}`}>
                    {round.multiplier}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {round.winner || "-"}
                  </td>
                </tr>
              ))}
              {rounds.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No rounds found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Round Details Modal */}
      {selectedRound && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-[#1a1a24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
              <h2 className="text-xl font-bold text-white">Round Details: {selectedRound.id}</h2>
              <button onClick={() => setSelectedRound(null)} className="p-2 hover:bg-white/10 rounded-full transition">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {detailsLoading ? (
                <div className="py-12 text-center text-gray-500 animate-pulse">Loading detailed analysis...</div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1">Total Pool Collected</div>
                      <div className="text-2xl font-bold text-white">${selectedRound.pool ?? 0}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1">Total Payout (Lost)</div>
                      <div className="text-2xl font-bold text-red-400">${selectedRound.payout ?? 0}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-1">Net House Profit</div>
                      <div className={`text-2xl font-bold flex items-center gap-2 ${(selectedRound.profit ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(selectedRound.profit ?? 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        ${selectedRound.profit ?? 0}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bets Table */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Detailed Bet Log</h3>
                    <div className="bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                      <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-white/5 border-b border-white/5 text-gray-300 uppercase font-semibold text-xs">
                          <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Game</th>
                            <th className="px-4 py-3">Bet Number</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Win/Loss</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {selectedRound.bets && selectedRound.bets.length > 0 ? (
                            selectedRound.bets.map((bet: any) => (
                              <tr key={bet.id} className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3 text-white">{bet.user}</td>
                                <td className="px-4 py-3 text-gray-400 capitalize">{bet.game === 'spinwheel' ? 'Spinwheel' : (bet.game === 'spinwheelpro' ? 'Spinwheel Pro' : bet.game)}</td>
                                <td className="px-4 py-3">
                                  <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-xs border border-white/20">
                                    {bet.number}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-mono">₹{bet.amount}</td>
                                <td className="px-4 py-3">
                                  {bet.payout > 0 ? (
                                    <span className="text-green-400 font-bold">+₹{bet.payout}</span>
                                  ) : selectedRound.status === 'settled' ? (
                                    <span className="text-red-400">Lost</span>
                                  ) : (
                                    <span className="text-gray-500">Pending</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                                No bets placed in this round.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
