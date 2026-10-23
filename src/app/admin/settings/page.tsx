"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, CreditCard, CheckCircle2, QrCode } from "lucide-react";
import { fetchAdminSettings, updateAdminSettings } from "@/lib/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({
    platform_name: "RealSpinPro",
    support_email: "support@RealSpinPro.com",
    withdrawal_fee_percent: "2.5",
    min_withdrawal: "1000",
    active_payment_gateway: "cashfree",
    youpi_config: {
      payee_vpa: "harryshastri21@okaxis",
      payee_name: "RealSpinPro"
    },
    cashfree_config: {
      environment: "SANDBOX"
    },
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
        if (typeof data.youpi_config === 'string') {
          parsedSettings.youpi_config = JSON.parse(data.youpi_config);
        }
        if (typeof data.cashfree_config === 'string') {
          parsedSettings.cashfree_config = JSON.parse(data.cashfree_config);
        }
        if (typeof data.active_payment_gateway === 'string') {
          parsedSettings.active_payment_gateway = data.active_payment_gateway.replace(/['"]+/g, '');
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

  const handleYoupiChange = (key: string, value: any) => {
    setSettings((prev: any) => ({
      ...prev,
      youpi_config: {
        ...(prev.youpi_config || {}),
        [key]: value
      }
    }));
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
      
      {/* Dynamic Payment Gateway Switcher */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              Payment Gateway Management
            </h2>
            <p className="text-sm text-slate-500 mt-1">Switch dynamically between Cashfree and YouPI-PG Gateway anytime.</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            settings.active_payment_gateway === 'youpi' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-blue-100 text-blue-700 border border-blue-300'
          }`}>
            Active: {settings.active_payment_gateway === 'youpi' ? 'YouPI (Direct UPI)' : 'Cashfree'}
          </span>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cashfree Selector Card */}
            <div 
              onClick={() => handleChange("active_payment_gateway", "cashfree")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                settings.active_payment_gateway === "cashfree" 
                  ? "border-blue-600 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                    CF
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Cashfree PG</h3>
                    <p className="text-xs text-slate-500">Standard Card & Netbanking Gateway</p>
                  </div>
                </div>
                {settings.active_payment_gateway === "cashfree" && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <p className="text-xs text-slate-600">Supports Cards, Netbanking, Wallets & Cashfree Hosted Checkout.</p>
            </div>

            {/* YouPI Gateway Selector Card */}
            <div 
              onClick={() => handleChange("active_payment_gateway", "youpi")}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                settings.active_payment_gateway === "youpi" 
                  ? "border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20" 
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                    ⚡
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900">YouPI-PG Gateway</h3>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-200 text-emerald-800">0% FEES</span>
                    </div>
                    <p className="text-xs text-slate-500">Self-Hosted Direct UPI & Bank SMS Observation</p>
                  </div>
                </div>
                {settings.active_payment_gateway === "youpi" && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
              </div>
              <p className="text-xs text-slate-600">Zero transaction fees. Direct GPay, PhonePe, Paytm intents & dynamic vector QR.</p>
            </div>
          </div>

          {/* Direct UPI Configuration Fields (Shown ONLY when YouPI is selected) */}
          {settings.active_payment_gateway === "youpi" && (
            <div className="p-5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-600" />
                  Direct UPI Receiver Settings
                </h4>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                  0% FEE &bull; DIRECT UPI
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Payee UPI VPA / ID (Receiver)
                  </label>
                  <input 
                    type="text" 
                    value={settings.youpi_config?.payee_vpa || ""}
                    onChange={(e) => handleYoupiChange("payee_vpa", e.target.value)}
                    placeholder="e.g. harryshastri21@okaxis"
                    className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-sm text-slate-900 font-semibold focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500/20" 
                  />
                  <p className="text-[11px] text-emerald-700 mt-1 font-medium">
                    &bull; All user deposits will be transferred directly to this UPI ID.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Payee Business / Display Name</label>
                  <input 
                    type="text" 
                    value={settings.youpi_config?.payee_name || ""}
                    onChange={(e) => handleYoupiChange("payee_name", e.target.value)}
                    placeholder="RealSpinPro"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500" 
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Receiver name displayed inside Google Pay, PhonePe, and Paytm.</p>
                </div>
              </div>
            </div>
          )}
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
