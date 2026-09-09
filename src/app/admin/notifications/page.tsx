"use client";

import { Bell, AlertTriangle, ShieldAlert, CheckCircle, Info } from "lucide-react";
import { useState } from "react";

const MOCK_NOTIFS: any[] = [];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case "system": return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case "success": return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case "info":
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
          <p className="text-slate-500">System alerts and platform events.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-700 font-medium transition-colors shadow-sm"
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-200">
          {notifs.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No new notifications.
            </div>
          ) : notifs.map((n) => (
            <div key={n.id} className={`p-6 flex gap-4 transition-colors ${n.read ? 'bg-transparent' : 'bg-slate-50'}`}>
              <div className="mt-1">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>{n.title}</h3>
                  <span className="text-xs text-slate-500">{n.time}</span>
                </div>
                <p className="text-sm text-slate-500">{n.message}</p>
              </div>
              {!n.read && (
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
