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
    return <div className="p-8 text-center text-slate-500">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Platform Settings</h1>
        <p className="text-slate-500">Configure global platform branding and policies.</p>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">General Info</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Platform Name</label>
              <input 
                type="text" 
                value={settings.platform_name || ""}
                onChange={(e) => handleChange("platform_name", e.target.value)}
                className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Support Email</label>
              <input 
                type="email" 
                value={settings.support_email || ""}
                onChange={(e) => handleChange("support_email", e.target.value)}
                className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Financial Policies</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Withdrawal Fee (%)</label>
              <input 
                type="number" 
                value={settings.withdrawal_fee_percent || ""}
                onChange={(e) => handleChange("withdrawal_fee_percent", e.target.value)}
                className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Minimum Withdrawal (₹)</label>
              <input 
                type="number" 
                value={settings.min_withdrawal || ""}
                onChange={(e) => handleChange("min_withdrawal", e.target.value)}
                className="w-full bg-white border border-slate-300 shadow-sm rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20" 
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold text-fuchsia-600">Promotions & Bonuses</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Deposit Bonus (%)</label>
              <input 
                type="number" 
                value={settings.promotions?.deposit_bonus_percent || "0"}
                onChange={(e) => handlePromotionChange("deposit_bonus_percent", e.target.value)}
                className="w-full bg-white border border-fuchsia-300 shadow-sm rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/20" 
                placeholder="0"
              />
              <p className="text-xs text-slate-500">Percentage added automatically to every deposit.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Welcome Bonus (₹)</label>
              <input 
                type="number" 
                value={settings.promotions?.welcome_bonus_amount || "0"}
                onChange={(e) => handlePromotionChange("welcome_bonus_amount", e.target.value)}
                className="w-full bg-white border border-fuchsia-300 shadow-sm rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/20"
                placeholder="0" 
              />
              <p className="text-xs text-slate-500">Fixed amount given on signup (Requires backend integration later).</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
