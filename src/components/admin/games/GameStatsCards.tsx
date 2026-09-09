"use client";

import { useEffect, useState } from "react";
import { Coins, HandCoins, TrendingUp, Users, Activity } from "lucide-react";

interface GameStats {
  total_wagered: number;
  total_payout: number;
  total_profit: number;
  total_players: number;
  active_rounds: number;
}

export function GameStatsCards({ gameType }: { gameType: string }) {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api-proxy/admin/games/${gameType}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error(`Error fetching ${gameType} stats:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // 5s refresh for stats
    return () => clearInterval(interval);
  }, [gameType]);

  const cards = [
    {
      title: "Total Wagered",
      value: stats ? `₹${stats.total_wagered.toLocaleString()}` : "...",
      icon: Coins,
      color: "text-blue-600",
      bg: "bg-white border-blue-200 shadow-sm border-t-4 border-t-blue-500"
    },
    {
      title: "Total Payout",
      value: stats ? `₹${stats.total_payout.toLocaleString()}` : "...",
      icon: HandCoins,
      color: "text-red-600",
      bg: "bg-white border-red-200 shadow-sm border-t-4 border-t-red-500"
    },
    {
      title: "House Profit",
      value: stats ? `₹${stats.total_profit.toLocaleString()}` : "...",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-white border-emerald-200 shadow-sm border-t-4 border-t-emerald-500"
    },
    {
      title: "Unique Players",
      value: stats ? stats.total_players.toLocaleString() : "...",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-white border-purple-200 shadow-sm border-t-4 border-t-purple-500"
    },
    {
      title: "Active Sessions",
      value: stats ? stats.active_rounds.toLocaleString() : "...",
      icon: Activity,
      color: "text-amber-600",
      bg: "bg-white border-amber-200 shadow-sm border-t-4 border-t-amber-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`rounded-2xl p-6 border relative overflow-hidden group ${card.bg}`}>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-slate-500 text-xs font-semibold tracking-wider uppercase mb-2">{card.title}</p>
              {loading && !stats ? (
                <div className="h-8 w-24 bg-slate-100 rounded animate-pulse"></div>
              ) : (
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</h3>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-slate-50 border border-slate-100 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-500 ${card.color.replace('text-', 'bg-')}`}></div>
        </div>
      ))}
    </div>
  );
}
