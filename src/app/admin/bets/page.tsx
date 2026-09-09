"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Coins, CheckCircle, XCircle, Clock } from "lucide-react";
import { fetchAdminBets } from "@/lib/api";
import { formatIST } from "@/utils/dateFormatter";

export default function BetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadBets = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBets(startDate, endDate);
      setBets(data || []);
    } catch (err) {
      console.error("Error loading bets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBets();
    const interval = setInterval(loadBets, 5000); // Live poll every 5s
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  const filteredBets = bets.filter(bet => {
    const matchesSearch = bet.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (bet.user && bet.user.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || bet.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Live Bets</h1>
          <p className="text-slate-500">Monitor all platform betting activity in real-time.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-semibold flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Live Feed Active
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search by Bet ID or User..."
            className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-colors shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "won", "lost", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                statusFilter === status 
                  ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm" 
                  : "bg-transparent text-slate-500 border border-transparent hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4 mb-4">
        <div className="flex flex-col gap-1 text-sm text-slate-500">
          <label>Start Date</label>
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 shadow-sm"
          />
        </div>
        <div className="flex flex-col gap-1 text-sm text-slate-500">
          <label>End Date</label>
          <input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 shadow-sm"
          />
        </div>
        <div className="flex items-end pb-1">
          <button 
            onClick={() => { setStartDate(""); setEndDate(""); }}
            className="text-red-600 hover:text-red-700 px-2 py-1 text-sm font-medium"
          >
            Clear Dates
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bet ID</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Game</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Multiplier</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && bets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading live bets...
                  </td>
                </tr>
              ) : filteredBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-mono text-sm text-slate-500">{bet.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700 border border-blue-200">
                        {bet.user?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-900">{bet.user}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {bet.game === 'spinwheel' ? 'Spinwheel' : (bet.game === 'spinwheelpro' ? 'Spinwheel Pro' : bet.game)}
                  </td>
                  <td className="p-4 font-medium text-slate-900">₹{bet.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="text-purple-600 font-bold">{bet.multiplier}</span>
                  </td>
                  <td className="p-4">
                    {bet.status === "won" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200"><CheckCircle className="w-3 h-3" /> Won</span>}
                    {bet.status === "lost" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200"><XCircle className="w-3 h-3" /> Lost</span>}
                    {bet.status === "pending" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200"><Clock className="w-3 h-3" /> Pending</span>}
                  </td>
                  <td className="p-4 text-sm text-slate-500">{formatIST(bet.time)}</td>
                </tr>
              ))}
              {filteredBets.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No bets found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
