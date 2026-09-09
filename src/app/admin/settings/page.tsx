"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { fetchAdminSettings, updateAdminSettings } from "@/lib/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    platform_name: "RealSpinPro",
    support_email: "support@RealSpinPro.com",
    withdrawal_fee_percent: "2.5",
    min_withdrawal: "1000",
    promotions: {
      deposit_bonus_percent: "0",
      welcome_bonus_amount: "0"
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminSettings();
      if (data && Object.keys(data).length > 0) {
        let parsedSettings = { ...data };
        if (typeof data.promotions === 'string') {
          parsedSettings.promotions = JSON.parse(data.promotions);
        }
        setSettings((prev: any) => ({ ...prev, ...parsedSettings }));
      }
    } catch (err: any) {
      console.error("Failed to fetch settings", err);
      toast.error("Failed to load settings: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handlePromotionChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ 
      ...prev, 
      promotions: {
        ...(prev.promotions || {}),
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...settings };
      await updateAdminSettings(payload);
      toast.success("Settings saved successfully!");
    } catch (err: any) {
      console.error("Failed to save", err);
      toast.error("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-gray-400">Configure global platform branding and policies.</p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">General Info</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Platform Name</label>
              <input 
                type="text" 
                value={settings.platform_name || ""}
                onChange={(e) => handleChange("platform_name", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Support Email</label>
              <input 
                type="email" 
                value={settings.support_email || ""}
                onChange={(e) => handleChange("support_email", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Financial Policies</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Withdrawal Fee (%)</label>
              <input 
                type="number" 
                value={settings.withdrawal_fee_percent || ""}
                onChange={(e) => handleChange("withdrawal_fee_percent", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Minimum Withdrawal (₹)</label>
              <input 
                type="number" 
                value={settings.min_withdrawal || ""}
                onChange={(e) => handleChange("min_withdrawal", e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white text-neon-magenta drop-shadow-[0_0_8px_rgba(233,64,218,0.5)]">Promotions & Bonuses</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Deposit Bonus (%)</label>
              <input 
                type="number" 
                value={settings.promotions?.deposit_bonus_percent || "0"}
                onChange={(e) => handlePromotionChange("deposit_bonus_percent", e.target.value)}
                className="w-full bg-white/5 border border-neon-magenta/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-magenta" 
                placeholder="0"
              />
              <p className="text-xs text-gray-500">Percentage added automatically to every deposit.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Welcome Bonus (₹)</label>
              <input 
                type="number" 
                value={settings.promotions?.welcome_bonus_amount || "0"}
                onChange={(e) => handlePromotionChange("welcome_bonus_amount", e.target.value)}
                className="w-full bg-white/5 border border-neon-magenta/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-magenta"
                placeholder="0" 
              />
              <p className="text-xs text-gray-500">Fixed amount given on signup (Requires backend integration later).</p>
            </div>
          </div>
        </div>
      </div>



      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-neon-blue hover:bg-neon-blue/90 text-black font-bold rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
