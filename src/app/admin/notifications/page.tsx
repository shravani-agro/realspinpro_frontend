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
      case "alert": return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "system": return <ShieldAlert className="w-5 h-5 text-yellow-500" />;
      case "success": return <CheckCircle className="w-5 h-5 text-neon-emerald" />;
      case "info":
      default: return <Info className="w-5 h-5 text-neon-blue" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-gray-400">System alerts and platform events.</p>
        </div>
        <button 
          onClick={markAllRead}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-colors"
        >
          Mark all as read
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="divide-y divide-white/5">
          {notifs.map((n) => (
            <div key={n.id} className={`p-6 flex gap-4 transition-colors ${n.read ? 'bg-transparent' : 'bg-white/[0.02]'}`}>
              <div className="mt-1">
                {getIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${n.read ? 'text-gray-300' : 'text-white'}`}>{n.title}</h3>
                  <span className="text-xs text-gray-500">{n.time}</span>
                </div>
                <p className="text-sm text-gray-400">{n.message}</p>
              </div>
              {!n.read && (
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
