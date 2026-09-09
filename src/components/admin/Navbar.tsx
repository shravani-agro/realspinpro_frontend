"use client";

import { Bell, Search, Activity, User, Menu } from "lucide-react";

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

      </div>


    </header>
  );
}
