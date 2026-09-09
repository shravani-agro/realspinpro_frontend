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
      } catch (err) {
        console.error("Error loading dashboard data", err);
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
    { label: "Gross Gaming Revenue", value: formatCurrency(stats?.ggr), icon: DollarSign, color: "neon-blue" },
    { label: "Net Gaming Revenue", value: formatCurrency(stats?.ngr), icon: DollarSign, color: "neon-purple" },
    { label: "Net Profit", value: formatCurrency(stats?.profit), icon: Zap, color: "neon-magenta" },
    { label: "Gateway Balance", value: `₹${gatewayBalance}`, icon: Database, color: "neon-emerald" },
  ];

  const performanceKPIs = [
    { label: "Return to Player (RTP)", value: formatPercent(stats?.rtp), icon: Percent, color: "neon-blue", tooltip: "Percentage of total bets paid back to players" },
    { label: "House Margin", value: formatPercent(stats?.house_margin), icon: Percent, color: "neon-magenta", tooltip: "Percentage of total bets retained as profit" },
    { label: "Average Bet Size", value: formatCurrency(stats?.avg_bet_size), icon: Coins, color: "neon-emerald" },
    { label: "Total Spins (Rounds)", value: formatNumber(stats?.total_spins), icon: RefreshCw, color: "neon-purple" },
  ];

  const userKPIs = [
    { label: "Registered Users", value: formatNumber(stats?.total_registered_users), icon: Users, color: "neon-blue" },
    { label: "Active Today", value: formatNumber(stats?.active_users_today), icon: Activity, color: "neon-emerald" },
    { label: "Online Now (15m)", value: formatNumber(stats?.online_users), icon: Zap, color: "neon-magenta" },
    { label: "Platform Liability", value: formatCurrency(stats?.total_wallet_balance), icon: Wallet, color: "neon-purple", tooltip: "Total wallet balances of all users" },
  ];

  const renderKPIGrid = (kpis: any[], title: string) => (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 rounded-xl glass-panel relative overflow-hidden group">
            {kpi.color === 'neon-blue' && <div className="absolute top-0 right-0 w-20 h-20 bg-neon-blue/10 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-neon-blue/20 transition-colors" />}
            {kpi.color === 'neon-purple' && <div className="absolute top-0 right-0 w-20 h-20 bg-neon-purple/10 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-neon-purple/20 transition-colors" />}
            {kpi.color === 'neon-magenta' && <div className="absolute top-0 right-0 w-20 h-20 bg-neon-magenta/10 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-neon-magenta/20 transition-colors" />}
            {kpi.color === 'neon-emerald' && <div className="absolute top-0 right-0 w-20 h-20 bg-neon-emerald/10 rounded-full blur-xl -mr-8 -mt-8 group-hover:bg-neon-emerald/20 transition-colors" />}
            
            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className={`p-2 rounded-lg border ${
                kpi.color === 'neon-blue' ? 'bg-neon-blue/10 border-neon-blue/20 text-neon-blue' :
                kpi.color === 'neon-purple' ? 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple' :
                kpi.color === 'neon-magenta' ? 'bg-neon-magenta/10 border-neon-magenta/20 text-neon-magenta' :
                'bg-neon-emerald/10 border-neon-emerald/20 text-neon-emerald'
              }`} title={kpi.tooltip}>
                <kpi.icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-1 relative z-10 font-semibold uppercase tracking-wider">{kpi.label}</p>
            <h3 className="text-xl font-black text-white tracking-tight relative z-10">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-2 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Live analytics and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode("24h")} className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${viewMode === "24h" ? "bg-neon-blue/20 border-neon-blue/50 text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}>24h</button>
          <button onClick={() => setViewMode("all")} className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${viewMode === "all" ? "bg-neon-blue/20 border-neon-blue/50 text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]" : "bg-white/5 border-white/10 text-gray-300 hover:text-white"}`}>All Time</button>
        </div>
      </div>

      {renderKPIGrid(financialKPIs, "Financial Overview")}
      {renderKPIGrid(performanceKPIs, "Game Performance")}
      {renderKPIGrid(userKPIs, "User & Liability Metrics")}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 rounded-xl glass-panel lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6">7-Day Net Profit Trend</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenue_history || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f3ff', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00f3ff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Leaderboards */}
        <div className="space-y-6 flex flex-col">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-6 rounded-xl glass-panel flex-1">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-neon-blue" />
              Platform Leaders
            </h3>
            
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                  <Flame className="w-3 h-3 text-neon-magenta" />
                  Biggest Bettor
                </div>
                <div className="text-xl font-black text-white">{stats?.biggest_bettor || "N/A"}</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                  <Trophy className="w-3 h-3 text-neon-blue" />
                  Biggest Winner
                </div>
                <div className="text-xl font-black text-white">{stats?.biggest_winner || "N/A"}</div>
              </div>

              <div className="bg-neon-emerald/10 border border-neon-emerald/20 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-neon-emerald/20 blur-xl -mr-4 -mt-4 rounded-full" />
                <div className="text-xs text-neon-emerald uppercase font-bold tracking-wider mb-1 relative z-10">
                  Highest Win Today
                </div>
                <div className="text-2xl font-black text-white relative z-10">{formatCurrency(stats?.highest_win_today)}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Live Feed Row */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-xl glass-panel">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-white">Live Activity Feed</h3>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Live</div>
            <div className="w-2 h-2 rounded-full bg-neon-magenta animate-ping" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {liveFeed.length === 0 ? (
            <p className="text-sm text-gray-500 col-span-full py-4 text-center">No recent activity on the platform.</p>
          ) : (
            liveFeed.slice(0, 8).map((feed, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${feed.action === 'win' ? 'text-neon-emerald' : feed.action === 'bet' ? 'text-neon-purple' : 'text-neon-blue'}`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium text-sm truncate max-w-[80px]">{feed.user}</p>
                    <p className="text-xs text-gray-500 uppercase">{feed.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-mono font-bold text-sm ${feed.action === 'win' ? 'text-neon-emerald' : feed.action === 'bet' ? 'text-neon-purple' : 'text-white'}`}>
                    ₹{feed.amount.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-500">{formatIST(feed.time)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
