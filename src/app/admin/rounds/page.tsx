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
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-sm" />
          Live Rounds
        </h1>
        <button className="px-4 py-2 rounded-lg bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors shadow-sm flex items-center gap-2">
          <PlayCircle className="w-4 h-4" /> Pause Engine
        </button>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-500">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Round ID</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">Status / Time</th>
                <th className="px-6 py-4">Total Pool</th>
                <th className="px-6 py-4">Multiplier Result</th>
                <th className="px-6 py-4">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && rounds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Loading live rounds...
                  </td>
                </tr>
              ) : rounds.map((round) => (
                <tr 
                  key={round.id} 
                  onClick={() => handleRowClick(round.id)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${round.status === 'locked' ? 'bg-red-50' : ''}`}
                >
                  <td className="px-6 py-4 font-mono text-slate-500">{round.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{round.game}</td>
                  <td className="px-6 py-4">
                    {round.status === 'locked' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" /> Locked</span>}
                    {round.status === 'betting' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200"><Clock className="w-3 h-3" /> Betting</span>}
                    {round.status === 'settled' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300"><CheckCircle2 className="w-3 h-3" /> Settled</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-900">{round.pool}</td>
                  <td className={`px-6 py-4 font-black text-lg ${round.status === 'locked' ? 'text-blue-600' : round.status === 'betting' ? 'text-slate-500' : 'text-emerald-600'}`}>
                    {round.multiplier}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {round.winner || "-"}
                  </td>
                </tr>
              ))}
              {rounds.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Round Details: {selectedRound.id}</h2>
              <button onClick={() => setSelectedRound(null)} className="p-2 hover:bg-slate-200 rounded-full transition">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              {detailsLoading ? (
                <div className="py-12 text-center text-slate-500 animate-pulse">Loading detailed analysis...</div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Total Pool Collected</div>
                      <div className="text-2xl font-bold text-slate-900">${selectedRound.pool ?? 0}</div>
                    </div>
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Total Payout (Lost)</div>
                      <div className="text-2xl font-bold text-red-600">${selectedRound.payout ?? 0}</div>
                    </div>
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
                      <div className="text-sm text-slate-500 mb-1">Net House Profit</div>
                      <div className={`text-2xl font-bold flex items-center gap-2 ${(selectedRound.profit ?? 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {(selectedRound.profit ?? 0) >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                        ${selectedRound.profit ?? 0}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bets Table */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Detailed Bet Log</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold text-xs">
                          <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Game</th>
                            <th className="px-4 py-3">Bet Number</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Win/Loss</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {selectedRound.bets && selectedRound.bets.length > 0 ? (
                            selectedRound.bets.map((bet: any) => (
                              <tr key={bet.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 text-slate-900">{bet.user}</td>
                                <td className="px-4 py-3 text-slate-500 capitalize">{bet.game === 'spinwheel' ? 'Spinwheel' : (bet.game === 'spinwheelpro' ? 'Spinwheel Pro' : bet.game)}</td>
                                <td className="px-4 py-3">
                                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs border border-slate-300">
                                    {bet.number}
                                  </span>
                                </td>
                                <td className="px-4 py-3 font-mono text-slate-900">₹{bet.amount}</td>
                                <td className="px-4 py-3">
                                  {bet.payout > 0 ? (
                                    <span className="text-emerald-600 font-bold">+₹{bet.payout}</span>
                                  ) : selectedRound.status === 'settled' ? (
                                    <span className="text-red-600">Lost</span>
                                  ) : (
                                    <span className="text-slate-500">Pending</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
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
