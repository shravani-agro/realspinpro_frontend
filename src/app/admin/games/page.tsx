"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, Activity, Target, Percent, DollarSign, Crosshair, Settings2 } from "lucide-react";
import { fetchAdminSettings, updateAdminSettings, fetchAdminStats } from "@/lib/api";
import { toast } from "sonner";

export default function GameOperationsPage() {
  const [config, setConfig] = useState<any>({
    mode: "profit_driven",
    target_margin: 30,
    multipliers: {
      "1x": 80,
      "2x": 15,
      "3x": 5
    }
  });

  const [boommine, setBoommine] = useState<any>({
    house_edge: 0.97,
    rig_probability: 0.0
  });

  const [tosstoss, setTosstoss] = useState<any>({
    house_edge: 0.98,
    rig_probability: 0.0
  });
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [settingsData, statsData] = await Promise.all([
        fetchAdminSettings(),
        fetchAdminStats()
      ]);
      
      if (settingsData) {
        if (settingsData.spinwheel_config) {
          const parsed = typeof settingsData.spinwheel_config === 'string' 
            ? JSON.parse(settingsData.spinwheel_config) 
            : settingsData.spinwheel_config;
          setConfig(parsed);
        }
        if (settingsData.boommine) {
          const parsed = typeof settingsData.boommine === 'string' 
            ? JSON.parse(settingsData.boommine) 
            : settingsData.boommine;
          setBoommine(parsed);
        }
        if (settingsData.tosstoss) {
          const parsed = typeof settingsData.tosstoss === 'string' 
            ? JSON.parse(settingsData.tosstoss) 
            : settingsData.tosstoss;
          setTosstoss(parsed);
        }
      }
      
      if (statsData) {
        setStats(statsData);
      }
    } catch (err: any) {
      console.error("Failed to fetch data", err);
      toast.error("Failed to load game operations data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpinModeChange = (mode: string) => {
    setConfig((prev: any) => ({ ...prev, mode }));
  };

  const handleSpinChange = (key: string, value: string | number) => {
    setConfig((prev: any) => ({ ...prev, [key]: Number(value) }));
  };

  const handleSpinMultiplierChange = (key: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      multipliers: {
        ...prev.multipliers,
        [key]: Number(value)
      }
    }));
  };

  const handleBoommineChange = (key: string, value: string) => {
    setBoommine((prev: any) => ({ 
      ...prev, 
      [key]: value === "" ? "" : parseFloat(value)
    }));
  };

  const handleTosstossChange = (key: string, value: string) => {
    setTosstoss((prev: any) => ({ 
      ...prev, 
      [key]: value === "" ? "" : parseFloat(value)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        spinwheel_config: config,
        boommine: boommine,
        tosstoss: tosstoss
      };
      await updateAdminSettings(payload);
      toast.success("Game controls saved successfully!");
    } catch (err: any) {
      console.error("Failed to save", err);
      toast.error("Failed to save controls: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading Game Operations Dashboard...</div>;
  }

  const spinTotalWeight = (config.multipliers?.["1x"] || 0) + (config.multipliers?.["2x"] || 0) + (config.multipliers?.["3x"] || 0);

  const gameStats = stats?.game_stats || [];
  const spinStats = gameStats.find((g: any) => g.name === 'SpinWheel') || { total_bet_amount: 0, total_payout: 0, total_bets_count: 0 };
  const boomStats = gameStats.find((g: any) => g.name === 'BoomMine') || { total_bet_amount: 0, total_payout: 0, total_bets_count: 0 };
  const tossStats = gameStats.find((g: any) => g.name === 'TossToss') || { total_bet_amount: 0, total_payout: 0, total_bets_count: 0 };

  const spinProfit = spinStats.total_bet_amount - spinStats.total_payout;
  const boomProfit = boomStats.total_bet_amount - boomStats.total_payout;
  const tossProfit = tossStats.total_bet_amount - tossStats.total_payout;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Game Operations</h1>
          <p className="text-gray-400">Monitor live statistics and perfectly control the profitability of each game independently.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-neon-blue hover:bg-neon-blue/90 text-black font-bold rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save All Controls"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========================================================= */}
        {/* ==================== wheel challenge ========================= */}
        {/* ========================================================= */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl border border-amber-500/20 overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-gradient-to-r from-amber-500/10 to-transparent">
              <h2 className="text-xl font-bold text-amber-500 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                <Target className="w-5 h-5" /> Wheel Challenge Control
              </h2>
            </div>
            
            {/* Wheel Challenge Stats */}
            <div className="p-5 grid grid-cols-3 gap-4 border-b border-white/5 bg-black/20">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Wagered</p>
                <p className="text-lg font-bold text-white">₹{spinStats.total_bet_amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Paid Out</p>
                <p className="text-lg font-bold text-white">₹{spinStats.total_payout}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Net Profit</p>
                <p className={`text-lg font-bold ${spinProfit >= 0 ? 'text-neon-emerald drop-shadow-[0_0_8px_rgba(0,255,170,0.5)]' : 'text-red-500'}`}>
                  {spinProfit >= 0 ? '+' : ''}₹{spinProfit}
                </p>
              </div>
            </div>

            {/* Wheel Challenge Controls */}
            <div className="p-5 space-y-5">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-400">Logic Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => handleSpinModeChange("profit_driven")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${config.mode === 'profit_driven' ? 'border-amber-500 bg-amber-500/10' : 'border-white/10'}`}
                  >
                    <h3 className="font-bold text-white text-sm">Profit Driven (Rigged)</h3>
                  </div>
                  <div 
                    onClick={() => handleSpinModeChange("random")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${config.mode === 'random' ? 'border-amber-500 bg-amber-500/10' : 'border-white/10'}`}
                  >
                    <h3 className="font-bold text-white text-sm">Fair (Random)</h3>
                  </div>
                </div>
              </div>

              {config.mode === 'profit_driven' && (
                <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                  <label className="flex items-center justify-between text-sm font-semibold text-gray-300">
                    <span>Target Profit Margin (%)</span>
                    <span className="text-amber-500 font-bold">{config.target_margin}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={config.target_margin || 20}
                    onChange={(e) => handleSpinChange("target_margin", e.target.value)}
                    className="w-full accent-amber-500"
                  />
                  <p className="text-xs text-gray-500">Guarantees the house keeps exactly this % over time.</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-400">Multiplier Weights</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">1x ({( (config.multipliers?.["1x"] / spinTotalWeight) * 100).toFixed(0)}%)</p>
                    <input 
                      type="number" 
                      value={config.multipliers?.["1x"] || 0}
                      onChange={(e) => handleSpinMultiplierChange("1x", e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none" 
                    />
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-neon-blue/30">
                    <p className="text-xs text-neon-blue/70 mb-1">2x ({( (config.multipliers?.["2x"] / spinTotalWeight) * 100).toFixed(0)}%)</p>
                    <input 
                      type="number" 
                      value={config.multipliers?.["2x"] || 0}
                      onChange={(e) => handleSpinMultiplierChange("2x", e.target.value)}
                      className="w-full bg-black/50 border border-neon-blue/20 rounded-lg px-3 py-2 text-white focus:outline-none" 
                    />
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-neon-purple/30">
                    <p className="text-xs text-neon-purple/70 mb-1">3x ({( (config.multipliers?.["3x"] / spinTotalWeight) * 100).toFixed(0)}%)</p>
                    <input 
                      type="number" 
                      value={config.multipliers?.["3x"] || 0}
                      onChange={(e) => handleSpinMultiplierChange("3x", e.target.value)}
                      className="w-full bg-black/50 border border-neon-purple/20 rounded-lg px-3 py-2 text-white focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ==================== BOOM MINE ========================== */}
        {/* ========================================================= */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl border border-neon-emerald/20 overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-gradient-to-r from-neon-emerald/10 to-transparent">
              <h2 className="text-xl font-bold text-neon-emerald flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,255,170,0.5)]">
                <Crosshair className="w-5 h-5" /> Boom Mine Control
              </h2>
            </div>
            
            {/* Boom Mine Stats */}
            <div className="p-5 grid grid-cols-3 gap-4 border-b border-white/5 bg-black/20">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Wagered</p>
                <p className="text-lg font-bold text-white">₹{boomStats.total_bet_amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Paid Out</p>
                <p className="text-lg font-bold text-white">₹{boomStats.total_payout}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Net Profit</p>
                <p className={`text-lg font-bold ${boomProfit >= 0 ? 'text-neon-emerald drop-shadow-[0_0_8px_rgba(0,255,170,0.5)]' : 'text-red-500'}`}>
                  {boomProfit >= 0 ? '+' : ''}₹{boomProfit}
                </p>
              </div>
            </div>

            {/* Boom Mine Controls */}
            <div className="p-5 space-y-5">
              <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                <label className="flex items-center justify-between text-sm font-semibold text-gray-300">
                  <span>Aggressive Rig Probability</span>
                  <span className="text-neon-emerald font-bold">{(boommine.rig_probability * 100).toFixed(0)}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={boommine.rig_probability ?? 0.0}
                  onChange={(e) => handleBoommineChange("rig_probability", e.target.value)}
                  className="w-full accent-neon-emerald"
                />
                <p className="text-xs text-gray-500">Base chance to silently swap a bomb onto a safe tile when tapped. This naturally multiplies as the user gets greedier.</p>
              </div>

              <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                <label className="flex items-center justify-between text-sm font-semibold text-gray-300">
                  <span>House Edge Multiplier</span>
                  <span className="text-neon-emerald font-bold">{boommine.house_edge}</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={boommine.house_edge ?? 0.97}
                  onChange={(e) => handleBoommineChange("house_edge", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-emerald" 
                />
                <p className="text-xs text-gray-500">Invisibly lowers payouts across the board (e.g. 0.95 = 5% edge).</p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* ==================== TOSS TOSS ========================== */}
        {/* ========================================================= */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl border border-neon-blue/20 overflow-hidden">
            <div className="p-5 border-b border-white/5 bg-gradient-to-r from-neon-blue/10 to-transparent">
              <h2 className="text-xl font-bold text-neon-blue flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">
                <Target className="w-5 h-5" /> Toss Toss Stats
              </h2>
            </div>
            
            {/* Toss Toss Stats */}
            <div className="p-5 grid grid-cols-3 gap-4 border-b border-white/5 bg-black/20">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Wagered</p>
                <p className="text-lg font-bold text-white">₹{tossStats.total_bet_amount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Paid Out</p>
                <p className="text-lg font-bold text-white">₹{tossStats.total_payout}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Net Profit</p>
                <p className={`text-lg font-bold ${tossProfit >= 0 ? 'text-neon-emerald drop-shadow-[0_0_8px_rgba(0,255,170,0.5)]' : 'text-red-500'}`}>
                  {tossProfit >= 0 ? '+' : ''}₹{tossProfit}
                </p>
              </div>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                <label className="flex items-center justify-between text-sm font-semibold text-gray-300">
                  <span>Aggressive Rig Probability</span>
                  <span className="text-neon-blue font-bold">{(tosstoss.rig_probability * 100).toFixed(0)}%</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01"
                  value={tosstoss.rig_probability ?? 0.0}
                  onChange={(e) => handleTosstossChange("rig_probability", e.target.value)}
                  className="w-full accent-neon-blue"
                />
                <p className="text-xs text-gray-500">Base chance to silently force a loss regardless of user's prediction.</p>
              </div>

              <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                <label className="flex items-center justify-between text-sm font-semibold text-gray-300">
                  <span>House Edge Multiplier</span>
                  <span className="text-neon-blue font-bold">{tosstoss.house_edge}</span>
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={tosstoss.house_edge ?? 0.98}
                  onChange={(e) => handleTosstossChange("house_edge", e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue" 
                />
                <p className="text-xs text-gray-500">Adjusts the base payout multiplier (e.g. 0.98 = 1.96x payout per flip).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
