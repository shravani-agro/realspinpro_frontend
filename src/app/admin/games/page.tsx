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

  /*
  const [boommine, setBoommine] = useState<any>({
    house_edge: 0.97,
    rig_probability: 0.0
  });

  const [tosstoss, setTosstoss] = useState<any>({
    house_edge: 0.98,
    rig_probability: 0.0
  });
  */
  
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
        /*
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
        */
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

  /*
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
  */

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        spinwheel_config: config,
        // boommine: boommine,
        // tosstoss: tosstoss
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
    return <div className="p-8 text-center text-slate-500">Loading Game Operations Dashboard...</div>;
  }

  const spinTotalWeight = (config.multipliers?.["1x"] || 0) + (config.multipliers?.["2x"] || 0) + (config.multipliers?.["3x"] || 0);

  const gameStats = stats?.game_stats || [];
  const spinStats = gameStats.find((g: any) => g.name === 'SpinWheel') || { total_bet_amount: 0, total_payout: 0, total_bets_count: 0 };
  // const boomStats = gameStats.find((g: any) => g.name === 'BoomMine') || { total_bet_amount: 0, total_payout: 0, total_bets_count: 0 };
  // const tossStats = gameStats.find((g: any) => g.name === 'TossToss') || { total_bet_amount: 0, total_payout: 0, total_bets_count: 0 };

  const spinProfit = spinStats.total_bet_amount - spinStats.total_payout;
  // const boomProfit = boomStats.total_bet_amount - boomStats.total_payout;
  // const tossProfit = tossStats.total_bet_amount - tossStats.total_payout;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Game Operations</h1>
          <p className="text-slate-500">Monitor live statistics and perfectly control the profitability of each game independently.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-slate-900 font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-amber-50 to-transparent">
              <h2 className="text-xl font-bold text-amber-600 flex items-center gap-2">
                <Target className="w-5 h-5" /> Wheel Challenge Control
              </h2>
            </div>
            
            {/* Wheel Challenge Stats */}
            <div className="p-5 grid grid-cols-3 gap-4 border-b border-slate-200 bg-slate-50">
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Wagered</p>
                <p className="text-lg font-bold text-slate-900">₹{spinStats.total_bet_amount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Total Paid Out</p>
                <p className="text-lg font-bold text-slate-900">₹{spinStats.total_payout}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Net Profit</p>
                <p className={`text-lg font-bold ${spinProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {spinProfit >= 0 ? '+' : ''}₹{spinProfit}
                </p>
              </div>
            </div>

            {/* Wheel Challenge Controls */}
            <div className="p-5 space-y-5">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-600">Logic Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => handleSpinModeChange("profit_driven")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${config.mode === 'profit_driven' ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}
                  >
                    <h3 className="font-bold text-slate-900 text-sm">Profit Driven (Rigged)</h3>
                  </div>
                  <div 
                    onClick={() => handleSpinModeChange("random")}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${config.mode === 'random' ? 'border-amber-500 bg-amber-50' : 'border-slate-200'}`}
                  >
                    <h3 className="font-bold text-slate-900 text-sm">Fair (Random)</h3>
                  </div>
                </div>
              </div>

              {config.mode === 'profit_driven' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <label className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>Target Profit Margin (%)</span>
                    <span className="text-amber-600 font-bold">{config.target_margin}%</span>
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={config.target_margin || 20}
                    onChange={(e) => handleSpinChange("target_margin", e.target.value)}
                    className="w-full accent-amber-600"
                  />
                  <p className="text-xs text-slate-500">Guarantees the house keeps exactly this % over time.</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-600">Multiplier Weights</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white border border-slate-200 shadow-sm p-3 rounded-xl">
                    <p className="text-xs text-slate-500 mb-1">1x ({( (config.multipliers?.["1x"] / spinTotalWeight) * 100).toFixed(0)}%)</p>
                    <input 
                      type="number" 
                      value={config.multipliers?.["1x"] || 0}
                      onChange={(e) => handleSpinMultiplierChange("1x", e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
                    />
                  </div>
                  <div className="bg-white border border-blue-200 shadow-sm p-3 rounded-xl">
                    <p className="text-xs text-blue-600 mb-1">2x ({( (config.multipliers?.["2x"] / spinTotalWeight) * 100).toFixed(0)}%)</p>
                    <input 
                      type="number" 
                      value={config.multipliers?.["2x"] || 0}
                      onChange={(e) => handleSpinMultiplierChange("2x", e.target.value)}
                      className="w-full bg-white border border-blue-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
                    />
                  </div>
                  <div className="bg-white border border-purple-200 shadow-sm p-3 rounded-xl">
                    <p className="text-xs text-purple-600 mb-1">3x ({( (config.multipliers?.["3x"] / spinTotalWeight) * 100).toFixed(0)}%)</p>
                    <input 
                      type="number" 
                      value={config.multipliers?.["3x"] || 0}
                      onChange={(e) => handleSpinMultiplierChange("3x", e.target.value)}
                      className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20" 
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
