"use client";

import { useEffect, useState } from "react";
import { PlayCircle, CheckCircle2, Search, Zap } from "lucide-react";

interface GameRound {
  id: string;
  game: string;
  status: string;
  pool: string | number;
  multiplier: string;
  time: string;
}

export function GameRoundsTable({ gameType, title = "Live Rounds" }: { gameType: string, title?: string }) {
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRounds = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api-proxy/admin/games/${gameType}/rounds?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRounds(data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${gameType} rounds:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
    const interval = setInterval(fetchRounds, 3000);
    return () => clearInterval(interval);
  }, [gameType]);

  const filteredRounds = rounds.filter(r => r.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center">
            <PlayCircle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-wide">{title}</h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Latest 50 events</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search Round ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Pool</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Multiplier</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading && rounds.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  <div className="flex justify-center mb-2">
                    <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  Loading data...
                </td>
              </tr>
            ) : filteredRounds.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 font-medium">No rounds found.</td>
              </tr>
            ) : (
              filteredRounds.map((round) => (
                <tr key={round.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-500 group-hover:text-purple-600 transition-colors">
                      {round.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-slate-900">{typeof round.pool === 'number' ? `₹${round.pool}` : round.pool}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-600">{round.multiplier}</td>
                  <td className="p-4 text-right">
                    {round.status === "settled" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                      </span>
                    ) : round.status === "active" || round.status === "open" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold uppercase tracking-wider">
                        <Zap className="w-3.5 h-3.5 animate-pulse" /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold uppercase tracking-wider">
                        {round.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
