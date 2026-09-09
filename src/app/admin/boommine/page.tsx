"use client";

import { useState, useEffect } from "react";
import { Bomb, Gem, TrendingUp, Users, DollarSign, RefreshCw, ShieldOff, ArrowUpRight, ArrowDownRight } from "lucide-react";

const API_BASE = "/api-proxy";

function getAdminHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function formatIST(dateStr: string) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function BoomMineAdminPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Use the dedicated BoomMine admin API endpoint
      const res = await fetch(`${API_BASE}/admin/boommine/sessions?limit=100`, {
        headers: getAdminHeaders(),
      });
      if (!res.ok) {
        setError("Failed to load sessions");
        return;
      }
      const data = await res.json();
      setSessions(data || []);
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Compute stats from sessions
  const totalGames = sessions.length;
  const totalBet = sessions.reduce((s, r) => s + (parseInt(r.bet_amount) || 0), 0);
  const totalPayout = sessions.reduce((s, r) => s + (parseInt(r.payout) || 0), 0);
  const houseProfit = totalBet - totalPayout;
  const wins = sessions.filter(r => r.status === "cashed_out" || r.status === "won").length;
  const losses = sessions.filter(r => r.status === "lost").length;
  const active = sessions.filter(r => r.status === "active").length;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0.0";
  const houseEdgePct = totalBet > 0 ? ((houseProfit / totalBet) * 100).toFixed(1) : "0.0";

  const statCards = [
    { label: "Total Games",    value: totalGames,                           icon: Bomb,        color: "text-red-600",           border: "border-red-200",    bg: "bg-red-50" },
    { label: "Total Wagered",  value: `₹${totalBet.toLocaleString()}`,      icon: DollarSign,  color: "text-blue-600",          border: "border-blue-200",  bg: "bg-blue-50" },
    { label: "Total Payouts",  value: `₹${totalPayout.toLocaleString()}`,   icon: TrendingUp,  color: "text-purple-600",        border: "border-purple-200",bg: "bg-purple-50" },
    { label: "House Profit",   value: `₹${houseProfit.toLocaleString()}`,   icon: Gem,         color: "text-emerald-600",       border: "border-emerald-200",bg: "bg-emerald-50" },
    { label: "Player Win Rate",value: `${winRate}%`,                        icon: Users,       color: "text-amber-600",         border: "border-amber-200", bg: "bg-amber-50" },
    { label: "House Edge",     value: `${houseEdgePct}%`,                   icon: ShieldOff,   color: "text-fuchsia-600",       border: "border-fuchsia-200",bg: "bg-fuchsia-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Bomb className="w-7 h-7 text-red-500" />
            BoomMine Sessions
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Completely isolated from SpinWheel — own tables: <code className="text-blue-600 font-mono bg-blue-50 px-1 rounded text-xs border border-blue-100">boommine_sessions</code> · <code className="text-blue-600 font-mono bg-blue-50 px-1 rounded text-xs border border-blue-100">boommine_ledger</code>
          </p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-300 shadow-sm text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 font-medium">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-medium">{error}</div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(card => (
          <div key={card.label} className={`p-4 rounded-xl border shadow-sm ${card.border} ${card.bg}`}>
            <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
            <div className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-1">{card.label}</div>
            <div className={`text-lg font-black ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Active games banner */}
      {active > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
          <span className="text-blue-700 font-bold">{active}</span>
          <span className="text-blue-600 text-sm">game{active > 1 ? "s" : ""} currently active</span>
        </div>
      )}

      {/* W/L summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-4 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200 relative z-10">
            <ArrowUpRight className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="relative z-10">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Players Won (cashed out)</div>
            <div className="text-2xl font-black text-emerald-600">{wins}</div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-4 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-100 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center border border-red-200 relative z-10">
            <ArrowDownRight className="w-5 h-5 text-red-600" />
          </div>
          <div className="relative z-10">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Players Lost (hit mine)</div>
            <div className="text-2xl font-black text-red-600">{losses}</div>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-bold text-slate-900 flex items-center justify-between">
          <span>Recent Sessions <span className="text-slate-500 text-sm font-normal ml-2">({sessions.length} records)</span></span>
          <span className="text-xs text-slate-500 font-normal">Source: boommine_sessions table only</span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-slate-400" /> Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-12 text-center">
              <Bomb className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No BoomMine sessions yet.</p>
              <p className="text-slate-400 text-sm mt-1">Sessions will appear here once players start a game.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600 min-w-[1000px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Session</th>
                  <th className="px-6 py-4">Player</th>
                  <th className="px-6 py-4">Bet</th>
                  <th className="px-6 py-4">Mines</th>
                  <th className="px-6 py-4">Gems</th>
                  <th className="px-6 py-4">Multiplier</th>
                  <th className="px-6 py-4 text-right">Payout</th>
                  <th className="px-6 py-4 text-right">P&L</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sessions.map((row: any, i: number) => {
                  const statusMap: Record<string, string> = {
                    cashed_out: "text-emerald-700 bg-emerald-50 border-emerald-200",
                    won:        "text-emerald-700 bg-emerald-50 border-emerald-200",
                    lost:       "text-red-700 bg-red-50 border-red-200",
                    active:     "text-blue-700 bg-blue-50 border-blue-200",
                  };
                  const statusColor = statusMap[row.status] || "text-slate-600 bg-slate-50 border-slate-200";
                  const profit = parseInt(row.profit) || 0;
                  return (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-400 text-xs">#{row.id}</td>
                      <td className="px-6 py-4 text-slate-900 font-medium">{row.username || row.user_id}</td>
                      <td className="px-6 py-4 font-mono text-slate-900 font-medium">₹{parseInt(row.bet_amount).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-md border border-red-100">
                          <Bomb className="w-3 h-3" /> {row.mine_count}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <Gem className="w-3 h-3" /> {row.gems_found}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-purple-600 font-bold">x{parseFloat(row.multiplier || "1").toFixed(2)}</td>
                      <td className="px-6 py-4 font-mono font-medium text-slate-900 text-right">
                        {parseInt(row.payout) > 0 ? `₹${parseInt(row.payout).toLocaleString()}` : "-"}
                      </td>
                      <td className={`px-6 py-4 font-mono font-bold text-right ${profit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                        {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${statusColor}`}>{row.status}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">{formatIST(row.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
