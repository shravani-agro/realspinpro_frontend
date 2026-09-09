"use client";

import { useState, useEffect } from "react";
import { Users, Activity } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { fetchAdminStats } from "@/lib/api";

const COLORS = ["#2563eb", "#9333ea", "#16a34a", "#d97706"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchAdminStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (!mounted || loading) {
    return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;
  }

  const revenueData = stats?.revenue_history || [];
  const totalRevenue7d = revenueData.reduce((acc: number, item: any) => acc + (item.value || 0), 0);
  
  const rtp = stats?.total_bets > 0 ? ((stats.total_payout / stats.total_bets) * 100).toFixed(1) : "0.0";

  const gameData = stats?.game_stats?.map((g: any) => ({
    name: g.name.toLowerCase() === 'spinwheel' ? 'Spinwheel' : (g.name.toLowerCase() === 'spinwheelpro' ? 'Spinwheel Pro' : g.name),
    value: g.total_bets_count,
  })).filter((g: any) => g.name === 'Spinwheel' || g.name === 'Spinwheel Pro') || []; // fallback if no data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-500">Platform performance and revenue metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-slate-500 text-sm font-medium mb-1">Total Revenue (7d)</div>
          <div className="text-3xl font-bold text-slate-900 mb-2">₹{totalRevenue7d.toLocaleString()}</div>
          <div className="flex items-center text-emerald-600 text-sm font-bold gap-1">
            <Activity className="w-4 h-4" /> Live
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-slate-500 text-sm font-medium mb-1">Active Players (7d)</div>
          <div className="text-3xl font-bold text-slate-900 mb-2">{stats?.active_players || 0}</div>
          <div className="flex items-center text-blue-600 text-sm font-bold gap-1">
            <Users className="w-4 h-4" /> Active
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-slate-500 text-sm font-medium mb-1">Total Bets</div>
          <div className="text-3xl font-bold text-slate-900 mb-2">{stats?.total_bets_count?.toLocaleString() || 0}</div>
          <div className="flex items-center text-purple-600 text-sm font-bold gap-1">
            <Activity className="w-4 h-4" /> All-time
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-slate-500 text-sm font-medium mb-1">Avg. Return (RTP)</div>
          <div className="text-3xl font-bold text-slate-900 mb-2">{rtp}%</div>
          <div className="flex items-center text-yellow-600 text-sm font-bold gap-1">
            Stable
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-900 mb-6">7-Day Profit & Loss</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
              <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.2}/>
                  </linearGradient>
                  <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#dc2626" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value as number;
                      const isProfit = val >= 0;
                      return (
                        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl">
                          <p className="text-slate-500 text-xs mb-1">{payload[0].payload.time}</p>
                          <p className={`font-bold text-lg ${isProfit ? 'text-emerald-600' : 'text-red-600'}`}>
                            {isProfit ? '+' : ''}₹{val.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
                            {isProfit ? 'Net Profit' : 'Net Loss'}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 4, 4]} 
                  barSize={40}
                >
                  {revenueData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.value >= 0 ? "url(#colorProfit)" : "url(#colorLoss)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Game Distribution</h2>
          <p className="text-sm text-slate-500 mb-6">Total volume of bets placed by game.</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                <PieChart>
                  <Pie
                    data={gameData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {gameData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                            <div>
                              <p className="text-slate-500 text-xs">{payload[0].name}</p>
                              <p className="font-bold text-slate-900">{payload[0].value} Bets</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full mt-6 space-y-3">
              {gameData.map((entry: any, i: number) => {
                const total = gameData.reduce((acc: number, cur: any) => acc + cur.value, 0);
                const percent = total > 0 ? ((entry.value / total) * 100).toFixed(1) : "0.0";
                return (
                  <div key={entry.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-sm font-medium text-slate-900">{entry.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">{entry.value}</div>
                      <div className="text-xs text-slate-500">{percent}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
