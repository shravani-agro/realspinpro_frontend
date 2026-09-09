"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Search } from "lucide-react";

interface GameBet {
  id: string;
  user: string;
  game: string;
  amount: number;
  multiplier: string;
  status: string;
  time: string;
}

export function GameBetsTable({ gameType, title = "Live Bets" }: { gameType: string, title?: string }) {
  const [bets, setBets] = useState<GameBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBets = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api-proxy/admin/games/${gameType}/bets?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBets(data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${gameType} bets:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
    const interval = setInterval(fetchBets, 3000); // auto-refresh every 3s
    return () => clearInterval(interval);
  }, [gameType]);

  const filteredBets = bets.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-wide">{title}</h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Latest 50 actions</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search TxID or User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bet ID</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Multiplier</th>
              <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading && bets.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  <div className="flex justify-center mb-2">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  Loading data...
                </td>
              </tr>
            ) : filteredBets.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">No bets found.</td>
              </tr>
            ) : (
              filteredBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <span className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                      {bet.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-900 font-medium">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 border border-blue-200">
                        {bet.user.charAt(0).toUpperCase()}
                      </div>
                      {bet.user}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-slate-900">₹{bet.amount}</span>
                  </td>
                  <td className="p-4 text-sm font-bold text-slate-600">{bet.multiplier}</td>
                  <td className="p-4 text-right">
                    {bet.status === "won" || bet.status === "cashed_out" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Won
                      </span>
                    ) : bet.status === "lost" || bet.status === "busted" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 border border-red-200 text-xs font-bold uppercase tracking-wider">
                        <XCircle className="w-3.5 h-3.5" /> Lost
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending
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
