"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Users, DollarSign, Activity, Database, Server, Zap, 
  ArrowUpRight, ArrowDownRight, Percent, RefreshCw,
  Trophy, Flame, Coins, Wallet
} from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAdminStats, fetchAdminFeed, fetchGatewayBalance } from "@/lib/api";
import { formatIST } from "@/utils/dateFormatter";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [gatewayBalance, setGatewayBalance] = useState<string>("0.00");
  const [viewMode, setViewMode] = useState<"24h" | "all">("24h");

  useEffect(() => {
    let failCount = 0;
    let timer: NodeJS.Timeout;

    const loadData = async () => {
      try {
        const statsData = await fetchAdminStats(viewMode);
        setStats(statsData);

        const feedData = await fetchAdminFeed();
        setLiveFeed(feedData || []);

        const gatewayData = await fetchGatewayBalance();
        if (gatewayData?.balance) {
          setGatewayBalance(gatewayData.balance);
        }
        failCount = 0;
        timer = setTimeout(loadData, 5000);
      } catch (err: any) {
        // Suppress expected errors from adblockers, navigation aborts, or server restarts
        if (err.message !== "Failed to fetch") {
          console.error("Error loading dashboard data", err);
        }
        failCount++;
        const backoff = Math.min(5000 * Math.pow(2, failCount), 60000);
        timer = setTimeout(loadData, backoff);
      }
    };

    loadData();
    return () => clearTimeout(timer);
  }, [viewMode]);

  const formatCurrency = (val: number) => `₹${(val || 0).toLocaleString()}`;
  const formatPercent = (val: number) => `${(val || 0).toFixed(2)}%`;
  const formatNumber = (val: number) => (val || 0).toLocaleString();

  const financialKPIs = [
    { label: "Gross Gaming Revenue", value: formatCurrency(stats?.ggr), icon: DollarSign, color: "blue" },
    { label: "Net Gaming Revenue", value: formatCurrency(stats?.ngr), icon: DollarSign, color: "purple" },
    { label: "Net Profit", value: formatCurrency(stats?.profit), icon: Zap, color: "fuchsia" },
    { label: "Gateway Balance", value: `₹${gatewayBalance}`, icon: Database, color: "emerald" },
  ];

  const performanceKPIs = [
    { label: "Return to Player (RTP)", value: formatPercent(stats?.rtp), icon: Percent, color: "blue", tooltip: "Percentage of total bets paid back to players" },
    { label: "House Margin", value: formatPercent(stats?.house_margin), icon: Percent, color: "fuchsia", tooltip: "Percentage of total bets retained as profit" },
    { label: "Average Bet Size", value: formatCurrency(stats?.avg_bet_size), icon: Coins, color: "emerald" },
    { label: "Total Spins (Rounds)", value: formatNumber(stats?.total_spins), icon: RefreshCw, color: "purple" },
  ];

  const userKPIs = [
    { label: "Registered Users", value: formatNumber(stats?.total_registered_users), icon: Users, color: "blue" },
    { label: "Active Today", value: formatNumber(stats?.active_users_today), icon: Activity, color: "emerald" },
    { label: "Online Now (15m)", value: formatNumber(stats?.online_users), icon: Zap, color: "fuchsia" },
    { label: "Platform Liability", value: formatCurrency(stats?.total_wallet_balance), icon: Wallet, color: "purple", tooltip: "Total wallet balances of all users" },
  ];

  const renderKPIGrid = (kpis: any[], title: string) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className={`p-2 rounded-lg border ${
                kpi.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                kpi.color === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-600' :
                kpi.color === 'fuchsia' ? 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-600' :
                'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`} title={kpi.tooltip}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-1 relative z-10 font-semibold uppercase tracking-wider">{kpi.label}</p>
            <h3 className="text-xl font-black text-slate-900 tracking-tight relative z-10">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-2 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Live analytics and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode("24h")} className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${viewMode === "24h" ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"}`}>24h</button>
          <button onClick={() => setViewMode("all")} className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${viewMode === "all" ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900"}`}>All Time</button>
        </div>
      </div>

      {renderKPIGrid(financialKPIs, "Financial Overview")}
      {renderKPIGrid(performanceKPIs, "Game Performance")}
      {renderKPIGrid(userKPIs, "User & Liability Metrics")}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">7-Day Net Profit Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <AreaChart data={stats?.revenue_history || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}
                  itemStyle={{ color: '#2563eb', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Leaderboards */}
        <div className="space-y-6 flex flex-col">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-600" />
              Platform Leaders
            </h3>
            
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                  <Flame className="w-3 h-3 text-fuchsia-600" />
                  Biggest Bettor
                </div>
                <div className="text-xl font-black text-slate-900">{stats?.biggest_bettor || "N/A"}</div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                  <Trophy className="w-3 h-3 text-blue-600" />
                  Biggest Winner
                </div>
                <div className="text-xl font-black text-slate-900">{stats?.biggest_winner || "N/A"}</div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 relative overflow-hidden">
                <div className="text-xs text-emerald-700 uppercase font-bold tracking-wider mb-1 relative z-10">
                  Highest Win Today
                </div>
                <div className="text-2xl font-black text-emerald-900 relative z-10">{formatCurrency(stats?.highest_win_today)}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Live Feed Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Live Activity Feed</h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Live</div>
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveFeed.length === 0 ? (
            <p className="text-sm text-slate-500 col-span-full py-4 text-center">No recent activity on the platform.</p>
          ) : (
            liveFeed.slice(0, 8).map((feed, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 ${feed.action === 'win' ? 'text-emerald-600' : feed.action === 'bet' ? 'text-purple-600' : 'text-blue-600'}`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium text-sm truncate max-w-[80px]">{feed.user}</p>
                    <p className="text-xs text-slate-500 uppercase">{feed.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-bold text-sm ${feed.action === 'win' ? 'text-emerald-600' : feed.action === 'bet' ? 'text-purple-600' : 'text-slate-900'}`}>
                    ₹{feed.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-500">{formatIST(feed.time)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
